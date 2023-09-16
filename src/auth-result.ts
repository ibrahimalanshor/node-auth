import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from './user';
import AuthConfig from './auth-config';

export type AccessToken = string;
export interface AccessTokenPayload {
  id: number;
  email: string;
}

export class AuthResult<T extends User> {
  constructor(private user: T) {}

  public getUser(): T {
    return this.user;
  }

  public async getToken(): Promise<AccessToken> {
    const user = this.getUser();
    const payload: AccessTokenPayload = {
      id: user.id,
      email: user.email,
    };

    const secret = AuthConfig.getSecret() ?? 'secret';
    const options: SignOptions = AuthConfig.getOptions() ?? {
      expiresIn: '15m',
    };

    return await jwt.sign(payload, secret, options);
  }
}
