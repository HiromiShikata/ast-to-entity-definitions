import type { Id } from 'ast-to-entity-definitions';
import type { User } from './User';

export type Administrator = {
  id: Id;
  userId: User['id'];
  role: 'administrator';
  deactivated: boolean;
  cachedDetail: object;
  createdAt: Date;
};
