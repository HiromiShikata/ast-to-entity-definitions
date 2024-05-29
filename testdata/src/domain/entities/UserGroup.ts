import type { Id } from 'ast-to-entity-definitions';
import type { User } from './User';
import type { Group } from './Group';

export type UserGroup = {
  id: Id;
  userId: User['id'];
  groupId: Group['id'];
};
