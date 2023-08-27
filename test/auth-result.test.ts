import { describe, expect, test } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { AccessTokenPayload } from '../src/auth';
import { AuthResult } from '../src/auth-result';

interface User {
  id: number;
  email: string;
  name: string;
  password: string;
}
const user: User = {
  id: 1,
  name: 'Test',
  email: 'test@gmail.com',
  password: 'password',
};

describe('auth result test', () => {
  test('auth result must be callable', () => {
    expect(typeof AuthResult).toEqual('function');
  });

  test('auth result must have getToken and getUser method', () => {
    expect(AuthResult.prototype).toHaveProperty('getUser');
    expect(AuthResult.prototype).toHaveProperty('getToken');

    expect(typeof AuthResult.prototype.getUser).toEqual('function');
    expect(typeof AuthResult.prototype.getToken).toEqual('function');
  });

  test('auth result getUser method must returns user object', () => {
    const authResult = new AuthResult<User>(user);

    expect(authResult.getUser()).toEqual(user);
  });

  test('auth result getToken method must returns jwt token', async () => {
    const authResult = new AuthResult<User>(user);

    const token = await authResult.getToken({ secret: 'test' });
    const payload = (await jwt.verify(token, 'test')) as AccessTokenPayload;

    expect(token).toBeTruthy();
    expect(payload).toHaveProperty('id');
    expect(payload).toHaveProperty('email');
    expect(payload.id).toEqual(user.id);
    expect(payload.email).toEqual(user.email);
  });
});
