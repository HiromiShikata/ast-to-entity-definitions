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
      .flatMap((sourceFile) => sourceFile.getTypeAliases());

    const typeDefinitionAsts = typeDeclarations
      .filter((t) => t.getType().isObject())
      .map((typeDeclaration) => {
        const typeName = typeDeclaration.getName();
        const properties: EntityPropertyDefinition[] = typeDeclaration
          .getType()
          .getProperties()
          .map((property): EntityPropertyDefinition | null => {
            const name = property.getName();
            const valueDeclaration = property.getValueDeclaration();
            if (!valueDeclaration) {
              return null;
            }
            const ref =
              valueDeclaration.getDescendantsOfKind(
                SyntaxKind.TypeReference,
              )[0] || null;
            const nullable = this.isNullable(valueDeclaration);
            if (!ref) {
              const propertyType = this.decideTypeForPrimitive(
                valueDeclaration.getType(),
              );
              if (propertyType === null) {
                throw new Error(
                  `unexpected type: ${valueDeclaration
                    .getType()
                    .getText()}, propertyName: ${name}, typeName: ${typeName}`,
                );
              }
              return {
                isReference: false,
                name,
                propertyType,
                isNullable: nullable,
              };
            }
            const isUnique = ref.getText().indexOf('Unique<') === 0;
            const propertyType = isUnique
              ? ref
                  .getText()
                  .replace(/^Unique</g, '')
                  .replace(/\[.*?$/g, '')
              : ref.getText();
            return {
              isReference: true,
              name,
              propertyType,
              isUnique,
              isNullable: nullable,
            };
          })
          .filter((item): item is EntityPropertyDefinition => item !== null);
        return { typeName, properties };
      });

    return typeDefinitionAsts;
  }

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
  decideTypeForPrimitive = (
    type: ts.Type,
  ): 'boolean' | 'number' | 'string' | 'Date' | null => {
    const mapTypeToTypeName = (
      t: ts.Type,
    ): EntityPropertyDefinitionPrimitive['propertyType'] | null => {
      if (t.isBoolean() || t.isBooleanLiteral()) {
        return 'boolean';
      } else if (t.isNumber() || t.isNumberLiteral()) {
        return 'number';
      } else if (t.isString() || t.isStringLiteral()) {
        return 'string';
      } else if (t.getText() === 'Date') {
        return 'Date';
      }
      return null;
    };
    if (!type.isUnion()) {
      return mapTypeToTypeName(type);
    }
    const reducedType = type
      .getUnionTypes()
      .filter((t) => !t.isNull() && !t.isUndefined())
      .map((t): 'boolean' | 'number' | 'string' | 'Date' | null => {
        if (t.isBoolean() || t.isBooleanLiteral()) {
          return 'boolean';
        } else if (t.isNumber() || t.isNumberLiteral()) {
          return 'number';
        } else if (t.isString() || t.isStringLiteral()) {
          return 'string';
        } else if (t.getText() === 'Date') {
          return 'Date';
        }
        return null;
      })
      .reduce(
        (
          accumulator: ('boolean' | 'number' | 'string' | 'Date')[],
          currentValue,
        ) => {
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
