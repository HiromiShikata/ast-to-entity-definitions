import { EntityDefinition } from './EntityDefinition';
import { RelationDefinition } from './RelationDefinition';

export type Definition = {
  entityDefinitions: EntityDefinition[];
  relationDefinitions: RelationDefinition[];
};
