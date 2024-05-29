import { Id } from 'ast-to-entity-definitions';
import { User } from './User';
import { Group } from './Group';

export type UserGroup = {
  id: Id;
  userId: User['id'];
  groupId: Group['id'];
};
