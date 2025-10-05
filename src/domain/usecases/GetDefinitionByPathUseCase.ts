import { EntityDefinitionRepository } from './adapter-interfaces/EntityDefinitionRepository';
import { EntityDefinition } from '../entities/EntityDefinition';

export type GetDefinitionByPathOptions = {
  excludeTypeNames?: string[];
};

export class GetDefinitionByPathUseCase {
  constructor(
    readonly entityDefinitionRepository: EntityDefinitionRepository,
  ) {}
  run = async (
    directoryPath: string,
    options?: GetDefinitionByPathOptions,
  ): Promise<EntityDefinition[]> => {
    const entityDefinitions = await this.entityDefinitionRepository.find(
      directoryPath,
    );

    return entityDefinitions.filter(
      (def) =>
        !options?.excludeTypeNames ||
        !options.excludeTypeNames.includes(def.name),
    );
  };
}
