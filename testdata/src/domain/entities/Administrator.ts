export type Administrator = {
  id: string;
  userId: User['id'];
  role: 'administrator';
  deactivated: boolean;
  createdAt: Date;
};
