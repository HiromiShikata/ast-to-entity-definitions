import { User } from './User';
import { Unique } from '../../../../src/domain/entities/Unique';

export type UserAddress = {
  id: string;
  userId: Unique<User['id']>;
  address: string;
};
