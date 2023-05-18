export interface AuthInterface {
  email: string;
  password: string;
}

export interface TokenInterface {
  refreshToken: string;
  accessToken: string;
}

export interface TokenAuthInterface extends AuthInterface, TokenInterface {}
