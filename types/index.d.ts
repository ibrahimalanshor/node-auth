import { Secret, SignOptions } from 'jsonwebtoken';

declare module 'otentikasi' {
  declare type RegisterCredential<T> = Partial<T>;
  declare type AccessToken = string;

  declare interface AuthConfigInterface {
    setSecret: (secret: Secret) => this;
    setOptions: (options: SignOptions) => this;
    getSecret: () => Secret;
    getOptions: () => SignOptions;
  }
  declare interface LoginCredential {
    email: string;
    password: string;
  }
  declare interface User {
    id: number;
    email: string;
    password: string;
  }

  declare const AuthConfig: AuthConfigInterface;

  declare class AuthResult<T extends User> {
    constructor(private user: T) {}

    public getUser(): T;
    public async getToken(): Promise<AccessToken>;
  }

  declare abstract class Auth<T extends User> {
    protected abstract createUser(
      credential: RegisterCredential<T>,
    ): Promise<T>;
    protected abstract findUserByEmail(email: string): Promise<T>;
    protected abstract findUserById(id: number): Promise<T | null>;

    public async register(
      credential: RegisterCredential<T>,
    ): Promise<AuthResult<T>>;
    public async login(credential: LoginCredential): Promise<AuthResult<T>>;
    public async authenticate(accessToken: AccessToken): Promise<T>;
  }

  declare class AuthError extends BaseError<
    'REGISTER_ERROR' | 'LOGIN_ERROR' | 'AUTHENTICATE_ERROR'
  > {}

  declare class BaseError<ErrorName extends string> extends Error {
    name: ErrorName;
    message: string;
    cause: any;

    constructor({
      name,
      message,
      cause,
    }: {
      name: ErrorName;
      message: string;
      cause?: any;
    }) {}
  }
}
