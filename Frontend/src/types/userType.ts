export interface User {
  name: string;
  last_name: string;
  email: string;
  type: string;
  password: string;
  avatar: string;
  modelo?: string;
  provider?: string;
  //quitar
  _id: string;
}

// Crea un usuario sin incluir el campo id
export type CreateUserInput = Omit<User, 'id'>;

// Actualiza un usuario sin el campo id
// types/user.ts
export interface UpdateUserInput {
  name?: string;
  last_name?: string;
  email?: string;
  modelo?: string;
  provider?: string;
}

export interface UpdatePasswordInput {
  password: string;
}
