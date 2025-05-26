import { AuthService } from '../../services/auth.service';
import { LoginDto, JwtTokensDto } from '../../dtos/auth.dto';

export class LoginUseCase {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public async execute(loginDto: LoginDto): Promise<JwtTokensDto> {
        return this.authService.login(loginDto);
    }
}
