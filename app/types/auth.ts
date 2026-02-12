import { User } from "./user";

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  username?: string;
  agreeToTerms?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface GoogleOAuthRequest {
  googleId: string;
  email: string;
  fullName: string;
  avatar?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: TokenResponse;
}
