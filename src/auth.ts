import { AuthError } from './errors/auth.error';

export interface RegisterCredential {
  email: string;
  password: string;
}

export abstract class Auth {
  protected abstract createUser(credential: RegisterCredential): Promise<any>;

  async register(credential: RegisterCredential) {
    try {
      await this.createUser(credential);

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
