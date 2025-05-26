import { Request, Response } from 'express';
import { LoginUseCase, RefreshTokenUseCase, GetSessionUseCase } from '../../application/useCases/auth';
import { LoginDto } from '../../application/dtos/auth.dto';
import { AuthService } from '../../application/services/auth.service';
import { UserRepository } from '../../infrastructure';
import config from '../../infrastructure/config';

export class AuthController {
    private readonly authService: AuthService;
    private readonly loginUseCase: LoginUseCase;
    private readonly refreshTokenUseCase: RefreshTokenUseCase;
    private readonly getSessionUseCase: GetSessionUseCase;

    constructor() {
        this.authService = new AuthService(new UserRepository());
        this.loginUseCase = new LoginUseCase(this.authService);
        this.refreshTokenUseCase = new RefreshTokenUseCase(this.authService);
        this.getSessionUseCase = new GetSessionUseCase(this.authService);
    }

    private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
        const accessTokenMaxAge = config.jwt.tokenExpiresIn * 1000;
        const refreshTokenMaxAge = config.jwt.refreshExpiresTokenIn * 1000;

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: accessTokenMaxAge,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: refreshTokenMaxAge,
        });
    }

    public async login(req: Request, res: Response): Promise<void> {
        const loginDto: LoginDto = req.body;
        try {
            const tokens = await this.loginUseCase.execute(loginDto);
            this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                userType: tokens.userType,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    }

    //para produccion
    public async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ message: 'No se encontró el token de actualización' });
                return;
            }
            const tokens = await this.refreshTokenUseCase.execute({ refreshToken });
            this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
            res.status(200).json({
                message: 'Tokens renovados correctamente',
                userType: tokens.userType,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    }

    public async getSession(req: Request, res: Response): Promise<void> {
        try {
            const token = req.cookies.accessToken;
            if (!token) {
                res.status(401).json({ message: 'No se encontró token de acceso' });
                return;
            }
            const user = await this.getSessionUseCase.execute(token);
            res.status(200).json(user);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    }

    public async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    }
}
