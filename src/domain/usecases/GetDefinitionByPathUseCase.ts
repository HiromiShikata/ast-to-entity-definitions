import { EntityDefinitionRepository } from './adapter-interfaces/EntityDefinitionRepository';
import { EntityDefinition } from '../entities/EntityDefinition';

export class GetDefinitionByPathUseCase {
  constructor(
    readonly entityDefinitionRepository: EntityDefinitionRepository,
  ) {}
  run = async (directoryPath: string): Promise<EntityDefinition[]> => {
    const entityDefinitions = await this.entityDefinitionRepository.find(
      directoryPath,
    );
    return entityDefinitions;
  };
}
