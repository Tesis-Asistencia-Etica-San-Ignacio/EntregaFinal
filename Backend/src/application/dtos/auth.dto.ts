import { Type, Static } from '@sinclair/typebox';

// DTO para login
export const LoginSchema = Type.Object({
  email: Type.String(),
  password: Type.String(),
});
export type LoginDto = Static<typeof LoginSchema>;

// DTO para refresh token
export const RefreshTokenSchema = Type.Object({
  refreshToken: Type.String(),
});
export type RefreshTokenDto = Static<typeof RefreshTokenSchema>;

// DTO para el acceso de tokens
export const JwtAccessTokenSchema = Type.Object({
  accessToken: Type.String(),
});
export type JwtAccessTokenDto = Static<typeof JwtAccessTokenSchema>;

// DTO para el refresh token
export const JwtRefreshTokenSchema = Type.Object({
  refreshToken: Type.String(),
});
export type JwtRefreshTokenDto = Static<typeof JwtRefreshTokenSchema>;

//devolver ambos tokens en la misma respuesta
export const JwtTokensSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
  userType: Type.String(),
  id: Type.String(),
});
export type JwtTokensDto = Static<typeof JwtTokensSchema>;
