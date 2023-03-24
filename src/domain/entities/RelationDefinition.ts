import { EntityDefinition } from './EntityDefinition';

export type RelationDefinition = {
  name: string;
  sourceEntityDefinitionName: EntityDefinition['typeName'];
  targetEntityDefinitionName: EntityDefinition['typeName'];
};
