import { AuthError } from './errors/auth.error';

export type RegisterCredential<T> = Partial<T>;

export abstract class Auth<T> {
  protected abstract createUser(credential: RegisterCredential<T>): Promise<T>;

  async register(credential: RegisterCredential<T>) {
    try {
      const user: T = await this.createUser(credential);

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
