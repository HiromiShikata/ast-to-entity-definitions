import { EntityDefinitionObject } from './EntityDefinition';

export type RelationDefinition = {
  name: string;
  sourceEntityDefinitionName: EntityDefinitionObject['name'];
  targetEntityDefinitionName: EntityDefinitionObject['name'];
};
