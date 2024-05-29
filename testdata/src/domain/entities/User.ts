import type { Id } from 'ast-to-entity-definitions';

export type User = {
  id: Id;
  name: string;
  deactivated: boolean;
  createdAt: Date;
  parentUserId: User['id'] | null;
};
