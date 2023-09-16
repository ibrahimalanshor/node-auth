import { beforeAll, describe, expect, test } from '@jest/globals';
import bcrypt from 'bcrypt';
import { Auth } from '../src/auth';
import { AuthError } from '../src/errors/auth.error';
import { AuthResult } from '../src/auth-result';

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

describe('login test', () => {
  beforeAll(async () => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  test('auth class must have login test', () => {
    expect(Auth.prototype).toHaveProperty('login');
    expect(typeof Auth.prototype.login).toEqual('function');
  });

  test('login method must throw login error if email is not found', async () => {
    class TestAuth extends Auth<User> {
      protected async createUser(credential: Partial<User>): Promise<User> {
        return user;
      }
      protected async findUserByEmail(email: string): Promise<User> {
        throw new Error();
      }
      protected async findUserById(id: number): Promise<User | null> {
        return user;
      }
    }

    const auth = new TestAuth();

    await expect(
      auth.login({ email: user.email, password: user.password }),
    ).rejects.toThrow(AuthError);
    await expect(
      auth.login({ email: user.email, password: user.password }),
    ).rejects.toThrow('Email is not found');
  });

  test('login method must throw login error if password is incorrect', async () => {
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

    await expect(
      auth.login({ email: user.email, password: 'incorrect password' }),
    ).rejects.toThrow(AuthError);
    await expect(
      auth.login({ email: user.email, password: 'incorrect password' }),
    ).rejects.toThrow('Password is incorrect');
  });

  test('login method must return jwt auth result', async () => {
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

    const res = await auth.login({ email: user.email, password: 'password' });

    expect(typeof res).toEqual('object');
    expect(res).toBeInstanceOf(AuthResult);
  });
});
