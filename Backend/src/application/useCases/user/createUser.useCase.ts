import { User, IUserRepository, IPromptRepository } from '../../../domain';
import { CreateUserDto } from '../..';
import bcrypt from 'bcryptjs';
import config from '../../../infrastructure/config';
import { seedPromptsForEvaluator } from '../../../application';


export class CreateEvaluatorUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly promptRepository: IPromptRepository
  ) {}

  public async execute(data: CreateUserDto): Promise<User> {
    // 1. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(
      data.password,
      config.jwt.saltRounds
    );

    // 2. Construir DTO con tipo EVALUADOR
    const userWithHashedPassword: CreateUserDto = {
      ...data,
      type: 'EVALUADOR',
      password: hashedPassword,
      
    };

    // 3. Crear el usuario en la BD
    const user = await this.userRepository.create(userWithHashedPassword);

    // 4. Sembrar los prompts base para este evaluador
    await seedPromptsForEvaluator(user.id, this.promptRepository);

    return user;
  }
}

export class CreateInvestigatorUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      data.password,
      config.jwt.saltRounds
    );

    const userWithHashedPassword: CreateUserDto = {
      ...data,
      type: 'INVESTIGADOR',
      password: hashedPassword,
    };

    return this.userRepository.create(userWithHashedPassword);
  }
}
