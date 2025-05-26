import { IUserRepository } from '../../../domain';
import { UserResponseDto } from '../..';

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(): Promise<UserResponseDto[]> {
    return this.userRepository.findAll();
  }
}

