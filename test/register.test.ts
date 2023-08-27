import { describe, test, expect } from '@jest/globals';
import { Auth, RegisterCredential } from '../src/auth';
import { AuthResult } from '../src/auth-result';
import { AuthError } from '../src/errors/auth.error';

interface User {
  id: number;
  email: string;
  name: string;
  password: string;
}
const user: User = {
  id: 1,
  email: 'test@email.com',
  name: 'Test',
  password: 'password',
};

describe('register test', () => {
  test('auth class must have register method', () => {
    expect(Auth.prototype).toHaveProperty('register');
    expect(typeof Auth.prototype.register).toEqual('function');
  });

  test('register method must return register error when crete user error', async () => {
    class TestAuth extends Auth<User> {
      protected async createUser(
        credential: RegisterCredential<User>,
      ): Promise<User> {
        throw new Error('User is already registered');
      }
      protected async findUserByEmail(email: string): Promise<User> {
        return user;
      }
    }
    const auth = new TestAuth();

    await expect(
      auth.register({ email: user.email, password: user.password }),
    ).rejects.toThrow(AuthError);
    await expect(
      auth.register({ email: user.email, password: user.password }),
    ).rejects.toThrow('User is already registered');
  });

  test('register method must return jwt auth result', async () => {
    class TestAuth extends Auth<User> {
      protected async createUser(
        credential: RegisterCredential<User>,
      ): Promise<User> {
        return user;
      }
      protected async findUserByEmail(email: string): Promise<User> {
        return user;
      }
    }
    const auth = new TestAuth();

    const res = await auth.register({
      email: user.email,
      password: user.password,
    });

    expect(typeof res).toEqual('object');
    expect(res).toBeInstanceOf(AuthResult);
  });
});
