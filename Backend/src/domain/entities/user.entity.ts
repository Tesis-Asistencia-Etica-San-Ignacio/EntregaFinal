export type UserType = 'EVALUADOR' | 'INVESTIGADOR';

export interface BaseUser {
  id: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
  type: UserType;
  modelo: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

export type User = BaseUser;
