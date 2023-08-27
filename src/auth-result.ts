import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from './user';

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

  public async getToken(options?: GetTokenOptions): Promise<string> {
    const user = this.getUser();
    const payload: AccessTokenPayload = {
      id: user.id,
      email: user.email,
    };

    return await jwt.sign(
      payload,
      options?.secret ?? 'secret',
      options?.signOptions,
    );
  }
}
