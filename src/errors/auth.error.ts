import { BaseError } from 'galat';

export class AuthError extends BaseError<
  'REGISTER_ERROR' | 'LOGIN_ERROR' | 'AUTHENTICATE_ERROR'
> {}
