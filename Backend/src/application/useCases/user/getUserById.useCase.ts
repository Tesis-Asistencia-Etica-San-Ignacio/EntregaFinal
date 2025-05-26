import { IUserRepository } from '../../../domain';
import { UserResponseDto } from '../../../application';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(id: string): Promise<UserResponseDto | null> {
    return this.userRepository.findById(id);
  }
}