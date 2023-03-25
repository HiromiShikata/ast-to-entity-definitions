import * as ts from 'ts-morph';
import { SyntaxKind } from 'ts-morph';
import { readdirSync, statSync } from 'fs';
import { EntityDefinition } from '../../domain/entities/EntityDefinition';
import { EntityDefinitionRepository } from '../../domain/usecases/adapter-interfaces/EntityDefinitionRepository';
import { EntityPropertyDefinition } from '../../domain/entities/EntityPropertyDefinition';

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

    const typeDefinitionAsts = typeDeclarations.map((typeDeclaration) => {
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
          if (!ref) {
            const propertyType = valueDeclaration.getType().getText();
            switch (propertyType) {
              case 'boolean':
              case 'number':
              case 'string':
              case 'Date':
                return {
                  isReference: false,
                  name,
                  propertyType,
                };
            }
            throw new Error(
              `unexpected type: ${propertyType}, propertyName: ${name}, typeName: ${typeName}`,
            );
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
          };
        })
        .filter((item): item is EntityPropertyDefinition => item !== null);
      return { typeName, properties };
    });

    return typeDefinitionAsts;
  }
}
