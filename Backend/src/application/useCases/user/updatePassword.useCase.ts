import { IUserRepository } from '../../../domain';
import bcrypt from 'bcryptjs';
import config from '../../../infrastructure/config';

interface UpdatePasswordDto {
  userId: string;
  password: string;
  newPassword: string;
}

export class UpdatePasswordUseCase {
  constructor(private readonly userRepository: IUserRepository) { }

  public async execute(data: UpdatePasswordDto): Promise<void> {
    const { userId, password, newPassword } = data;

    console.log("data", data)

    // 1. Buscar el usuario en la base de datos
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    console.log("user", user)

    // 2. Verificar que la contraseña actual coincida
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('La contraseña actual es incorrecta');
    }

    // 3. Hashear la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, config.jwt.saltRounds);

    // 4. Actualizar la contraseña en la base de datos
    await this.userRepository.update(userId, { password: hashedNewPassword });
  }
}