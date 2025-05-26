import { AuthService } from '../../services/auth.service';
import { RefreshTokenDto, JwtTokensDto } from '../../dtos/auth.dto';

export class RefreshTokenUseCase {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public async execute(refreshTokenDto: RefreshTokenDto): Promise<JwtTokensDto> {
        return this.authService.refreshToken(refreshTokenDto);
    }
}
