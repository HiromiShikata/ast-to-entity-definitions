import { Id } from 'ast-to-entity-definitions';

export type Group = {
  id: Id;
  name: string;
  category: 'Sports' | 'Music' | 'Movies';
};