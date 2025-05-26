import { User } from '../entities/user.entity';
import { UpdateUserDto, UserResponseDto } from '../../application';


export interface IUserRepository {
  findAll(): Promise<UserResponseDto[]>;
  findById(id: string): Promise<UserResponseDto | null>;
  create(data: Partial<Omit<User, "id">>): Promise<User>
  update(id: string, data: Partial<Omit<UpdateUserDto, 'id'>>): Promise<UserResponseDto | null>;
  delete(id: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
}