import { beforeAll, describe, expect, test } from '@jest/globals';
import { Auth } from '../src/auth';
import { AuthError } from '../src/errors/auth.error';
import { AuthResult } from '../src/auth-result';
import AuthConfig from '../src/auth-config';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}
const user: User = {
  id: 1,
  email: 'test@email.com',
  name: 'Test',
  password: 'password',
};

describe('autenticate user test', () => {
  beforeAll(() => {
    AuthConfig.setSecret('something');
  });

  test('auth claas must have authenticate method', () => {
    expect(Auth.prototype).toHaveProperty('authenticate');
    expect(typeof Auth.prototype.authenticate).toEqual('function');
  });

  test('authenticate must return authenticate error when access token invalid', async () => {
    class TestAuth extends Auth<User> {
      protected async createUser(credential: Partial<User>): Promise<User> {
        return user;
      }
      protected async findUserByEmail(email: string): Promise<User> {
        return user;
      }
      protected async findUserById(id: number): Promise<User | null> {
        return null;
      }
    }

    const auth = new TestAuth();

    await expect(auth.authenticate('invalid')).rejects.toThrow(AuthError);
    await expect(auth.authenticate('invalid')).rejects.toThrow(
      'Access token is invalid',
    );
  });

  test('authenticate must return authenticate error when user is not found', async () => {
    class TestAuth extends Auth<User> {
      protected async createUser(credential: Partial<User>): Promise<User> {
        return user;
      }
      protected async findUserByEmail(email: string): Promise<User> {
        return user;
      }
      protected async findUserById(id: number): Promise<User | null> {
        return null;
      }
    }

    const auth = new TestAuth();
    const authResult = new AuthResult(user);

    const accessToken = await authResult.getToken();

    await expect(auth.authenticate(accessToken)).rejects.toThrow(AuthError);
    await expect(auth.authenticate(accessToken)).rejects.toThrow(
      'User is not found',
    );
  });

  test('authenticate must return user when success', async () => {
    class TestAuth extends Auth<User> {
      protected async createUser(credential: Partial<User>): Promise<User> {
        return user;
      }
      protected async findUserByEmail(email: string): Promise<User> {
        return user;
      }
      protected async findUserById(id: number): Promise<User | null> {
        return user;
      }
    }

    const auth = new TestAuth();
    const authResult = new AuthResult(user);

    const accessToken = await authResult.getToken();

    await expect(auth.authenticate(accessToken)).resolves.toEqual(user);
  });
});
