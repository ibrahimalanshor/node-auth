import bcrypt from 'bcrypt';
import { AuthError } from './errors/auth.error';
import { User } from './user';
import { AuthResult } from './auth-result';

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
        message: err instanceof Error ? err.message : 'Craete User Error',
        cause: err,
      });
    }
  }

  async login(credential: LoginCredential) {
    try {
      const user = await this.findUserByEmail(credential.email);

      if (!(await bcrypt.compare(credential.password, user.password))) {
        throw new AuthError({
          name: 'LOGIN_ERROR',
          message: 'Password is incorrect',
        });
      }
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
}
