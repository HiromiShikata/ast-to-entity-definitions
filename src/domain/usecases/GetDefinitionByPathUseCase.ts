import { RelationDefinition } from '../entities/RelationDefinition';
import { Definition } from '../entities/Definition';
import { EntityDefinitionRepository } from './adapter-interfaces/EntityDefinitionRepository';

export class GetDefinitionByPathUseCase {
  constructor(
    readonly entityDefinitionRepository: EntityDefinitionRepository,
  ) {}
  run = async (directoryPath: string): Promise<Definition> => {
    const entityDefinitions = await this.entityDefinitionRepository.find(
      directoryPath,
    );

    const relationDefinitions: RelationDefinition[] = [];

    for (const entityDefinition of entityDefinitions) {
      for (const property of entityDefinition.properties) {
        switch (property.propertyType) {
          case 'string':
          case 'number':
          case 'boolean':
            continue;
        }
        relationDefinitions.push({
          name: property.name,
          sourceEntityDefinitionName: entityDefinition.typeName,
          targetEntityDefinitionName: property.propertyType,
        });
      }
    }
    return {
      entityDefinitions,
      relationDefinitions,
    };
  };
}
