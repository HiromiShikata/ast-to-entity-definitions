export type User = {
  id: string;
  name: string;
  deactivated: boolean;
  createdAt: Date;
  parentUserId: User['id'] | null;
};
