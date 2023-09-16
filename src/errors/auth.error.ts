import { BaseError } from './base.error';

export class AuthError extends BaseError<
  'REGISTER_ERROR' | 'LOGIN_ERROR' | 'AUTHENTICATE_ERROR'
> {}
