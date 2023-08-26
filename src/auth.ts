import bcrypt from 'bcrypt';
import { AuthError } from './errors/auth.error';

export interface User {
  email: string;
  password: string;
}
export type RegisterCredential<T> = User & Partial<T>;

export abstract class Auth<T extends User> {
  protected abstract createUser(credential: RegisterCredential<T>): Promise<T>;

  async register(credential: RegisterCredential<T>) {
    try {
      const user: T = await this.createUser({
        ...credential,
        password: await bcrypt.hash(credential.password, 10),
      });

      return new AuthResult();
    } catch (err) {
      throw new AuthError({
        name: 'REGISTER_ERROR',
        message: err instanceof Error ? err.message : 'Craete User Error',
        cause: err,
      });
    }
  }
}

export class AuthResult {}
