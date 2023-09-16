import bcrypt from 'bcrypt';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { AuthError } from './errors/auth.error';
import { User } from './user';
import { AccessToken, AuthResult } from './auth-result';
import AuthConfig from './auth-config';

export interface AccessTokenPayload {
  id: number;
  email: string;
}
export type RegisterCredential<T> = Partial<T>;
export interface LoginCredential {
  email: string;
  password: string;
}

export abstract class Auth<T extends User> {
  protected abstract createUser(credential: RegisterCredential<T>): Promise<T>;
  protected abstract findUserByEmail(email: string): Promise<T>;
  protected abstract findUserById(id: number): Promise<T | null>;

  async register(credential: RegisterCredential<T>): Promise<AuthResult<T>> {
    try {
      const user: T = await this.createUser({
        ...credential,
        ...(credential.password
          ? { password: await bcrypt.hash(credential.password, 10) }
          : {}),
      });

      return new AuthResult(user);
    } catch (err) {
      throw new AuthError({
        name: 'REGISTER_ERROR',
        message: 'User is already registered',
        cause: err,
      });
    }
  }

  async login(credential: LoginCredential): Promise<AuthResult<T>> {
    try {
      const user = await this.findUserByEmail(credential.email);

      if (!(await bcrypt.compare(credential.password, user.password))) {
        throw new AuthError({
          name: 'LOGIN_ERROR',
          message: 'Password is incorrect',
        });
      }

      return new AuthResult(user);
    } catch (err) {
      if (err instanceof AuthError) {
        throw err;
      }

      throw new AuthError({
        name: 'LOGIN_ERROR',
        message: 'Email is not found',
        cause: err,
      });
    }
  }

  async authenticate(accessToken: AccessToken) {
    try {
      if (!accessToken) {
        throw new AuthError({
          name: 'AUTHENTICATE_ERROR',
          message: 'Access token is invalid',
        });
      }

      const payload = (await jwt.verify(
        accessToken,
        AuthConfig.getSecret(),
      )) as AccessTokenPayload;
      const user = await this.findUserById(payload.id);

      if (!user) {
        throw new AuthError({
          name: 'AUTHENTICATE_ERROR',
          message: 'User is not found',
        });
      }

      return user;
    } catch (err) {
      if (err instanceof AuthError) {
        throw err;
      }

      if (err instanceof JsonWebTokenError) {
        throw new AuthError({
          name: 'AUTHENTICATE_ERROR',
          message: 'Access token is invalid',
        });
      }

      throw new AuthError({
        name: 'AUTHENTICATE_ERROR',
        message: 'Authentication Failed',
      });
    }
  }
}
