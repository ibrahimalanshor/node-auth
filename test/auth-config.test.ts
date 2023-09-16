import { describe, expect, test } from '@jest/globals';
import AuthConfig from '../src/auth-config';

describe('auth config test', () => {
  test('auth config must be an object', () => {
    expect(typeof AuthConfig).toEqual('object');
  });

  test('auth config must have secret set and get method', () => {
    expect(AuthConfig).toHaveProperty('setSecret');
    expect(AuthConfig).toHaveProperty('getSecret');
    expect(typeof AuthConfig.setSecret).toEqual('function');
    expect(typeof AuthConfig.getSecret).toEqual('function');
  });

  test('auth config must have options set and get method', () => {
    expect(AuthConfig).toHaveProperty('setOptions');
    expect(AuthConfig).toHaveProperty('getOptions');
    expect(typeof AuthConfig.setOptions).toEqual('function');
    expect(typeof AuthConfig.getOptions).toEqual('function');
  });

  test('auth config set and get secret must be setting secret correctly', () => {
    AuthConfig.setSecret('secret');

    expect(AuthConfig.getSecret()).toEqual('secret');
  });

  test('auth config set and get options must be setting options correctly', () => {
    AuthConfig.setOptions({
      expiresIn: '15m',
    });

    expect(AuthConfig.getOptions().expiresIn).toEqual('15m');
  });
});
