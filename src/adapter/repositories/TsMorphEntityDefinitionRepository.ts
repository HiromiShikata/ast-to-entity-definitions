import * as ts from 'ts-morph';
import { SyntaxKind } from 'ts-morph';
import { readdirSync, statSync } from 'fs';
import { EntityDefinition } from '../../domain/entities/EntityDefinition';
import { EntityDefinitionRepository } from '../../domain/usecases/adapter-interfaces/EntityDefinitionRepository';

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
      const properties = typeDeclaration
        .getType()
        .getProperties()
        .map((property) => {
          const name = property.getName();
          const valueDeclaration = property.getValueDeclaration();
          if (!valueDeclaration) {
            return;
          }
          const ref =
            valueDeclaration.getDescendantsOfKind(
              SyntaxKind.TypeReference,
            )[0] || null;
          const propertyType = ref
            ? ref.getText()
            : valueDeclaration.getType().getText();
          return { name, propertyType };
        })
        .filter(
          (item): item is { name: string; propertyType: string } =>
            item !== null,
        );
      return { typeName, properties };
    });

    return typeDefinitionAsts;
  }
}
