import type { Id, Unique } from 'ast-to-entity-definitions';
import type { User } from './User';

export type UserAddress = {
  id: Id;
  userId: Unique<User['id']>;
  address: Unique<string>;
  stringArray: string[];
  numberArray: number[];
  booleanArray: boolean[];
  dateArray: Date[];
  stringLiteral: 'home';
  numberLiteral: 1;
  booleanLiteral: true;
  nullableWithNullUnion: string | null;
  nullableWithUndefined: string | undefined;
  nullableWithQuestionMark?: string;
  unionLiteralsWithSameTypeNullable: 'dog' | 'cat' | null;
  unionLiteralsWithSameTypeQuestionMark?: 'dog' | 'cat';
  unionLiteralsWithSameType: 'dog' | 'cat';
};
