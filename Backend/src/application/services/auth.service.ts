import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { LoginDto, RefreshTokenDto, JwtTokensDto } from '../dtos/auth.dto';
import config from '../../infrastructure/config';
import { GetUserByIdUseCase, } from '../../application/useCases/user';
import { log } from 'console';

export class AuthService {
    private readonly userRepository: IUserRepository;
    private readonly getUserByIdUseCase: GetUserByIdUseCase;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
        this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    }

    // Login - Solo devuelve access token
    public async login(loginDto: LoginDto): Promise<JwtTokensDto> {
        const { email, password } = loginDto;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Credenciales inválidas');
        }
        const payload = { id: user.id, type: user.type };
        const accessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.tokenExpiresIn });
        const refreshToken = jwt.sign(payload, config.jwt.secretRefresh, { expiresIn: config.jwt.refreshExpiresTokenIn });
        return {
            accessToken,
            refreshToken,
            userType: user.type,
            id: user.id,
        };
    }

    // Refresh Token - Solo devuelve refresh token
    public async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<JwtTokensDto> {
        const { refreshToken } = refreshTokenDto;
        try {
            // Verifica el token
            const decoded: any = jwt.verify(refreshToken, config.jwt.secretRefresh);

            // Quita exp y iat del token decodificado (o extrae manualmente solo los datos relevantes)
            const { iat, exp, ...payload } = decoded;

            // Vuelve a firmar, asignándole un nuevo exp/iat
            const newAccessToken = jwt.sign(payload, config.jwt.secret, {
                expiresIn: config.jwt.tokenExpiresIn
            });


            return {
                accessToken: newAccessToken,
                refreshToken,
                userType: decoded.type,
                id: decoded.id,
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }


    public async getSession(token: string): Promise<any> {
        try {
            const decoded: any = jwt.verify(token, config.jwt.secret);
            log(decoded.id);
            const user = await this.getUserByIdUseCase.execute(decoded.id);
            log(user);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return user;
        } catch (error) {
            log('Error verifying token:', error);
            throw new Error('Token inválido o expirado');
        }
    }
}
