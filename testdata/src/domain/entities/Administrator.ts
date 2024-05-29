import { Id } from 'ast-to-entity-definitions';
import { User } from "./User";

export type Administrator = {
  id: Id;
  userId: User['id'];
  role: 'administrator';
  deactivated: boolean;
  createdAt: Date;
};
