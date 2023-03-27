import { User } from './User';
import { Unique } from '../../../../src/domain/entities/Unique';

export type UserAddress = {
  id: string;
  userId: Unique<User['id']>;
  address: string;
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
