import { User, IUserRepository } from '../../../domain';
import { UpdateUserDto } from '../..';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(id: string, data: User): Promise<UpdateUserDto | null> {
    return this.userRepository.update(id, data);
  }
}
