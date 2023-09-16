import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from './user';
import AuthConfig from './auth-config';

export type AccessToken = string;
export interface AccessTokenPayload {
  id: number;
  email: string;
}
export interface GetTokenOptions {
  secret?: string;
  signOptions?: SignOptions;
}

export class AuthResult<T extends User> {
  constructor(private user: T) {}

  public getUser(): T {
    return this.user;
  }

  public async getToken(options?: GetTokenOptions): Promise<AccessToken> {
    const user = this.getUser();
    const payload: AccessTokenPayload = {
      id: user.id,
      email: user.email,
    };

    return await jwt.sign(
      payload,
      options?.secret ? options.secret : AuthConfig.getSecret(),
      options?.signOptions ? options.signOptions : AuthConfig.getOptions(),
    );
  }
}
