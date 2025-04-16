// ./src/adapter/repositories/TsMorphEntityDefinitionRepository.ts
import * as ts from 'ts-morph';
import { Node, SyntaxKind } from 'ts-morph';
import { readdirSync, statSync } from 'fs';
import { EntityDefinition } from '../../domain/entities/EntityDefinition';
import { EntityDefinitionRepository } from '../../domain/usecases/adapter-interfaces/EntityDefinitionRepository';
import {
  EntityPropertyDefinition,
  EntityPropertyDefinitionPrimitive,
} from '../../domain/entities/EntityPropertyDefinition';
import { excludeNull } from '../../lib/collection';

export type PropertyTypeDeclaration = {
  hasQuestionMark: boolean;
  annotationText: string | null;
  isArray: boolean;
  arrayElement: Omit<PropertyTypeDeclaration, 'hasQuestionMark'> | null;
  union: Omit<PropertyTypeDeclaration, 'hasQuestionMark'>[] | null;
  indexedAccess: {
    index: Omit<PropertyTypeDeclaration, 'hasQuestionMark'>;
    object: Omit<PropertyTypeDeclaration, 'hasQuestionMark'>;
  } | null;
  node: ts.Node;
  typeText: string;
};

export class TsMorphEntityDefinitionRepository
  implements EntityDefinitionRepository
{
  private readonly project: ts.Project;

  constructor() {
    this.project = new ts.Project();
  }

  async find(path: string): Promise<EntityDefinition[]> {
    const stats = statSync(path);
    if (stats.isDirectory()) {
      const files = readdirSync(path).filter((file) => file.endsWith('.ts'));
      for (const file of files) {
        const filePath = `${path}/${file}`;
        this.project.addSourceFileAtPath(filePath);
      }
    } else if (stats.isFile() && path.endsWith('.ts')) {
      this.project.addSourceFileAtPath(path);
    } else {
      throw new Error('Invalid path');
    }

    const typeDeclarations = this.project
      .getSourceFiles()
      .flatMap((sourceFile) => {
        return [...sourceFile.getTypeAliases(), ...sourceFile.getInterfaces()];
      });

    const typeDefinitionAsts = typeDeclarations
      .filter((t) => t.getType().isObject() && t.isExported())
      .map((typeDeclaration) => {
        const entityName = typeDeclaration.getName();
        const properties: EntityPropertyDefinition[] = typeDeclaration
          .getDescendantsOfKind(SyntaxKind.PropertySignature)
          .map((property): EntityPropertyDefinition | null => {
            const propertyName = property.getName();
            const propertyTypeDeclaration =
              this.getPropertyTypeDeclaration(property);

            // EntityPropertyDefinitionId
            if (propertyTypeDeclaration.typeText === 'Id') {
              return {
                isReference: false,
                name: propertyName,
                propertyType: 'Id',
              };
            }
            const isUnique = this.isUnique(propertyTypeDeclaration);
            const isNullable = this.isNullable(propertyTypeDeclaration);
            const isArray = propertyTypeDeclaration.isArray;

            // EntityPropertyDefinitionReference
            if (
              propertyTypeDeclaration.indexedAccess?.index.typeText === "'id'"
            ) {
              return {
                isReference: true,
                name: propertyName,
                targetEntityDefinitionName:
                  propertyTypeDeclaration.indexedAccess.object.typeText,
                isUnique,
                isNullable: isNullable,
              };
            }
            const unionedIdIndexedTypeDeclaration =
              propertyTypeDeclaration.union?.find(
                (t) => t.indexedAccess?.index.typeText === "'id'",
              );
            if (unionedIdIndexedTypeDeclaration?.indexedAccess) {
              return {
                isReference: true,
                name: propertyName,
                targetEntityDefinitionName:
                  unionedIdIndexedTypeDeclaration.indexedAccess.object.typeText,
                isUnique,
                isNullable: isNullable,
              };
            }
            // EntityPropertyDefinitionPrimitive
            const primitiveTypeText = this.decideTypeForPrimitive(
              propertyTypeDeclaration,
            );
            if (primitiveTypeText) {
              const acceptableValues = this.getAcceptableValues(
                propertyTypeDeclaration,
              );
              return {
                isReference: false,
                name: propertyName,
                propertyType: primitiveTypeText,
                isUnique,
                isNullable,
                isArray,
                acceptableValues,
              };
            }
            return {
              isReference: false,
              name: propertyName,
              propertyType: 'typedStruct',
              structTypeName: propertyTypeDeclaration.typeText,
              isUnique,
              isNullable,
              isArray,
            };
          })
          .filter((item): item is EntityPropertyDefinition => item !== null);
        return { name: entityName, properties };
      });

    return typeDefinitionAsts;
  }
  getGenericTypeNode = (
    typeDeclaration: ts.Node,
  ): { typeNameText: string; typeArgumentNode: ts.TypeNode } | null => {
    // For generic types, treat as annotation. Example: Unique<string> => annotationText = Unique, typeParamsText = string
    if (!typeDeclaration.isKind(SyntaxKind.TypeReference)) {
      return null;
    }
    const typeArgumentNode =
      typeDeclaration?.getChildCount() > 0
        ? typeDeclaration?.getTypeArguments()?.[0] ?? null
        : null;
    if (!typeArgumentNode) {
      return null;
    }
    const typeNameText = typeArgumentNode
      ? typeDeclaration?.getTypeName().getText() ?? null
      : null;
    if (!typeNameText) {
      return null;
    }
    return {
      typeNameText,
      typeArgumentNode,
    };
  };
  getIndexedAccessTypeNode = (
    typeDeclaration: ts.Node,
  ): { indexTypeNode: ts.TypeNode; objectTypeNode: ts.TypeNode } | null => {
    if (!typeDeclaration.isKind(SyntaxKind.IndexedAccessType)) {
      return null;
    }
    const indexTypeNode = typeDeclaration.getIndexTypeNode();
    const objectTypeNode = typeDeclaration.getObjectTypeNode();
    return {
      indexTypeNode,
      objectTypeNode,
    };
  };
  getPropertyTypeDeclarationRecursively = (
    typeDeclarationNode: ts.Node,
  ): Omit<PropertyTypeDeclaration, 'hasQuestionMark'> => {
    const genericTypeNode = this.getGenericTypeNode(typeDeclarationNode);
    const indexedAccessTypeNode = this.getIndexedAccessTypeNode(
      genericTypeNode?.typeArgumentNode ?? typeDeclarationNode,
    );

    const targetTypeDeclaration =
      genericTypeNode?.typeArgumentNode ??
      indexedAccessTypeNode?.objectTypeNode ??
      typeDeclarationNode;

    const annotationText = genericTypeNode?.typeNameText ?? null;
    const indexedAccess = indexedAccessTypeNode
      ? {
          index: this.getPropertyTypeDeclarationRecursively(
            indexedAccessTypeNode.indexTypeNode,
          ),
          object: this.getPropertyTypeDeclarationRecursively(
            indexedAccessTypeNode.objectTypeNode,
          ),
        }
      : null;
    const arrayElement = targetTypeDeclaration.isKind(SyntaxKind.ArrayType)
      ? this.getPropertyTypeDeclarationRecursively(
          targetTypeDeclaration.getElementTypeNode(),
        )
      : null;
    const union: PropertyTypeDeclaration['union'] = excludeNull(
      targetTypeDeclaration.isKind(SyntaxKind.UnionType)
        ? targetTypeDeclaration.getTypeNodes().map((t) => {
            return this.getPropertyTypeDeclarationRecursively(t);
          })
        : targetTypeDeclaration.isKind(SyntaxKind.LiteralType)
        ? [
            {
              annotationText: null,
              indexedAccess: null,
              isArray: false,
              arrayElement: null,
              node: typeDeclarationNode,
              typeText: typeDeclarationNode.getText(),
              union: null,
            },
          ]
        : [],
    );
    const typeText = targetTypeDeclaration.getText();
    return {
      annotationText,
      indexedAccess,
      union: union.length > 0 ? union : null,
      isArray: !!arrayElement,
      arrayElement,
      node: targetTypeDeclaration,
      typeText,
    };
  };
  getPropertyTypeDeclaration = (
    propertySignature: ts.PropertySignature,
  ): PropertyTypeDeclaration => {
    const typeDeclarationNode = propertySignature.getTypeNode();
    if (!typeDeclarationNode) {
      throw new Error(
        `Type declaration node is null for property signature: ${propertySignature.getText()}`,
      );
    }
    const propertySignatureWithoutQuestionMark =
      this.getPropertyTypeDeclarationRecursively(typeDeclarationNode);
    const hasQuestionMark = propertySignature.hasQuestionToken();
    return {
      ...propertySignatureWithoutQuestionMark,
      hasQuestionMark,
    };
  };
  isUnique = (propertyTypeDeclaration: PropertyTypeDeclaration): boolean => {
    return propertyTypeDeclaration.annotationText === 'Unique';
  };
  isNullable = (propertyTypeDeclaration: PropertyTypeDeclaration): boolean => {
    if (propertyTypeDeclaration.hasQuestionMark) {
      return true;
    }
    return (
      propertyTypeDeclaration.union?.some((t) => {
        return t.node.getText() === 'null' || t.node.getText() === 'undefined';
      }) ?? false
    );
  };
  isArray = (valueDeclaration: Node): boolean => {
    return valueDeclaration.isKind(SyntaxKind.ArrayType);
  };
  primitiveTypeText = (
    text: string,
  ): 'boolean' | 'number' | 'string' | 'Date' | null => {
    if (
      text === 'boolean' ||
      text === 'number' ||
      text === 'string' ||
      text === 'Date'
    ) {
      return text;
    }
    return null;
  };
  getAcceptableValues = (
    propertyTypeDeclaration: PropertyTypeDeclaration,
  ): string[] | null => {
    if (
      propertyTypeDeclaration.union &&
      propertyTypeDeclaration.union.length > 0
    ) {
      const unionTypeTexts = excludeNull(
        propertyTypeDeclaration.union.map((t) => {
          if (!t.node.isKind(SyntaxKind.LiteralType)) {
            return null;
          }
          const text = t.node.getText().replace(/'/g, '');
          if (text === 'null' || text === 'undefined') {
            return null;
          }
          return text;
        }),
      );
      if (unionTypeTexts.length > 0) {
        return unionTypeTexts;
      }
    }
    return null;
  };
  decideTypeForPrimitive = (
    propertyTypeDeclaration: Omit<PropertyTypeDeclaration, 'hasQuestionMark'>,
  ): EntityPropertyDefinitionPrimitive['propertyType'] | null => {
    if (
      propertyTypeDeclaration.union &&
      propertyTypeDeclaration.union.length > 0
    ) {
      const unionTypes = propertyTypeDeclaration.union.map((t) => {
        return this.decideTypeForPrimitive(t);
      });
      const firstType = unionTypes[0];
      if (!firstType) {
        return null;
      }
      if (unionTypes.filter((t) => t !== null).some((t) => t !== firstType)) {
        throw new Error(
          `Union types are not the same for property: ${
            propertyTypeDeclaration.node.getParent()?.getText() || 'unknown'
          }, types: ${unionTypes.join(', ')}`,
        );
      }
      return firstType;
    }
    if (
      propertyTypeDeclaration.isArray &&
      propertyTypeDeclaration.arrayElement
    ) {
      return this.decideTypeForPrimitive(propertyTypeDeclaration.arrayElement);
    }
    if (
      propertyTypeDeclaration.node.getType().isBoolean() ||
      propertyTypeDeclaration.node.getType().isBooleanLiteral()
    ) {
      return 'boolean';
    } else if (
      propertyTypeDeclaration.node.getType().isNumber() ||
      propertyTypeDeclaration.node.getType().isNumberLiteral()
    ) {
      return 'number';
    } else if (
      propertyTypeDeclaration.node.getType().isString() ||
      propertyTypeDeclaration.node.getType().isStringLiteral()
    ) {
      return 'string';
    } else if (propertyTypeDeclaration.node.getText() === 'Date') {
      return 'Date';
    } else if (propertyTypeDeclaration.node.getText() === 'object') {
      return 'struct';
    }
    return null;
  };
}
