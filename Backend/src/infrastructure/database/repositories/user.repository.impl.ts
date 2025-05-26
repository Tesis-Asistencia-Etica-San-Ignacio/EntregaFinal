import { User as UserModel } from '../../../infrastructure';
import { User, IUserRepository } from '../../../domain';
import { UpdateUserDto, UserResponseDto } from '../../../application';


export class UserRepository implements IUserRepository {
  public async findAll(): Promise<UserResponseDto[]> {
    const users = await UserModel.find({});
    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      type: user.type,
    } as UserResponseDto));
  }

  public async findById(id: string): Promise<UserResponseDto | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name,
      last_name: user.last_name,
      password: user.password,
      email: user.email,
      type: user.type,
      modelo: user.modelo,
      provider: user.provider,
    } as UserResponseDto;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email });
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      type: user.type,
      modelo: user.modelo,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public async create(data: Omit<User, 'id'>): Promise<User> {
    const user = await UserModel.create(data);
    return {
      id: user._id.toString(),
      ...data,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public async update(id: string, data: Partial<Omit<UpdateUserDto, 'id'>>): Promise<UserResponseDto | null> {
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      type: user.type,
      modelo: user.modelo,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as UserResponseDto;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { password: hashedPassword });
  }
}
