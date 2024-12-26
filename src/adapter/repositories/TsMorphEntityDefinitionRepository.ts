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
      .filter((t) => t.getType().isObject())
      .map((typeDeclaration) => {
        const entityName = typeDeclaration.getName();
        const properties: EntityPropertyDefinition[] = typeDeclaration
          .getType()
          .getProperties()
          .map((property): EntityPropertyDefinition | null => {
            const proreptyName = property.getName();
            const valueDeclaration = property.getValueDeclaration();
            if (!valueDeclaration) {
              return null;
            }
            const ref =
              valueDeclaration.getDescendantsOfKind(
                SyntaxKind.TypeReference,
              )[0] || null;
            const isUnique = !!ref && ref.getText().indexOf('Unique<') === 0;
            const refText =
              (isUnique
                ? ref
                    ?.getText()
                    ?.replace(/^Unique</g, '')
                    ?.replace(/>$/g, '')
                : ref?.getText()) ?? null;

            // EntityPropertyDefinitionId
            if (refText === 'Id') {
              return {
                isReference: false,
                name: proreptyName,
                propertyType: 'Id',
              };
            }
            const isNullable = this.isNullable(valueDeclaration);
            const isArray = this.isArray(valueDeclaration);

            // EntityPropertyDefinitionPrimitive
            if (
              !refText ||
              refText === 'boolean' ||
              refText === 'number' ||
              refText === 'string' ||
              refText === 'Date'
            ) {
              const propertyType = refText
                ? this.primitiveTypeText(refText)
                : this.decideTypeForPrimitive(valueDeclaration.getType());
              if (propertyType === null) {
                throw new Error(
                  `unexpected type: ${valueDeclaration
                    .getType()
                    .getText()}, propertyName: ${proreptyName}, entityName: ${entityName}`,
                );
              }
              const acceptableValues = this.extractAcceptableValues(
                valueDeclaration.getType(),
              );

              return {
                isReference: false,
                name: proreptyName,
                propertyType,
                isUnique,
                isNullable,
                isArray,
                acceptableValues,
              };
            }

            // EntityPropertyDefinitionReference
            const propertyType = isUnique
              ? ref
                  .getText()
                  .replace(/^Unique</g, '')
                  .replace(/\[.*?$/g, '')
              : ref.getText();
            return {
              isReference: true,
              name: proreptyName,
              targetEntityDefinitionName: propertyType,
              isUnique,
              isNullable: isNullable,
            };
          })
          .filter((item): item is EntityPropertyDefinition => item !== null);
        return { name: entityName, properties };
      });

    return typeDefinitionAsts;
  }
  extractAcceptableValues = (type: ts.Type): string[] | null => {
    const literalValue = type.getLiteralValue();
    if (literalValue) {
      return [String(literalValue)];
    }
    if (!type.isUnion()) {
      return null;
    } else if (type.isBoolean()) {
      return null;
    }
    return type
      .getUnionTypes()
      .filter((t) => !t.isNull() && !t.isUndefined() && t.isLiteral())
      .map((t) => t.getText().replace(/"/g, ''));
  };

  isNullable = (valueDeclaration: Node): boolean => {
    if (
      valueDeclaration.getChildrenOfKind(SyntaxKind.QuestionToken).length > 0
    ) {
      return true;
    }

    const unionTypeNodes = valueDeclaration.getChildrenOfKind(
      ts.SyntaxKind.UnionType,
    );
    if (unionTypeNodes.length <= 0) {
      return false;
    }
    return !!unionTypeNodes[0]
      .getTypeNodes()
      .find((n) => n.getType().isNull() || n.getType().isUndefined());
  };
  isArray = (valueDeclaration: Node): boolean => {
    return (
      valueDeclaration.getDescendantsOfKind(SyntaxKind.ArrayType).length > 0
    );
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
  decideTypeForPrimitive = (
    type: ts.Type,
  ): EntityPropertyDefinitionPrimitive['propertyType'] | null => {
    const mapTypeToTypeName = (
      t: ts.Type,
    ): EntityPropertyDefinitionPrimitive['propertyType'] | null => {
      if (t.isArray()) {
        // extract element type of array
        const getArrayElementType = t.getArrayElementType();
        if (!getArrayElementType) {
          return null;
        }
        return this.decideTypeForPrimitive(getArrayElementType);
      }
      if (t.isBoolean() || t.isBooleanLiteral()) {
        return 'boolean';
      } else if (t.isNumber() || t.isNumberLiteral()) {
        return 'number';
      } else if (t.isString() || t.isStringLiteral()) {
        return 'string';
      } else if (t.getText() === 'Date') {
        return 'Date';
      } else if (t.getText() === 'object') {
        return 'struct';
      }
      return null;
    };
    if (!type.isUnion()) {
      return mapTypeToTypeName(type);
    }
    const reducedType = type
      .getUnionTypes()
      .filter((t) => !t.isNull() && !t.isUndefined())
      .map<EntityPropertyDefinitionPrimitive['propertyType'] | null>((t) => {
        if (t.isBoolean() || t.isBooleanLiteral()) {
          return 'boolean';
        } else if (t.isNumber() || t.isNumberLiteral()) {
          return 'number';
        } else if (t.isString() || t.isStringLiteral()) {
          return 'string';
        } else if (t.getText() === 'Date') {
          return 'Date';
        } else if (t.getText() === 'object') {
          return 'struct';
        }
        return null;
      })
      .reduce<EntityPropertyDefinitionPrimitive['propertyType'][]>(
        (accumulator, currentValue) => {
          if (currentValue !== null && !accumulator.includes(currentValue)) {
            accumulator.push(currentValue);
          }
          return accumulator;
        },
        [],
      );
    if (reducedType.length != 1) {
      return null;
    }
    return reducedType[0];
  };
}
