import { EntityDefinition } from '../../entities/EntityDefinition';

export interface EntityDefinitionRepository {
  find(filePaths: string[]): Promise<EntityDefinition[]>;
}
