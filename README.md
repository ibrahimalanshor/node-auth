# Otentikasi

## Install

```bash
npm install otentikasi
```

## Usage

Set Auth Config

```ts
import { AuthConfig } from 'otentikasi';

AuthConfig.setSecret('something-secret');
AuthConfig.setOptions({
  expiresIn: '15m',
});
```

Create user interface

```ts
interface User {
  id: number;
  email: string;
  password: string;
}
```

Create auth class

```ts
import { Auth, RegisterCredential } from 'otentikasi';

class MyAuth extends Auth<User> {
  protected async createUser(
    credential: RegisterCredential<User>,
  ): Promise<User> {
    return await this.userRepository.create(credential);
  }
  protected async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.find({ email });
  }
  protected async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}
```

Create auth object

```ts
const myAuth = new MyAuth();
```

Register, return `AuthResult`

```ts
// return `AuthResut`
const user = await myAuth.register({
  email: 'user@email.com',
  password: 'password',
});
```

Login, return `AuthResult`

```ts
// return `AuthResult`
const user = await myAuth.login({
  email: 'user@gmail.com',
  password: 'password',
});
```

Authenticate, accept jwt string, return user object

```ts
// return `User`
const user = await myAuth.authenticate('ed****');
```

`AuthResult.getToken()` return jwt token.

```ts
// return jwt
await newUser.getToken();
```

## Errors

Throws `AuthError` object.

```js
import { AuthError } from 'otentikasi';

try {
  // login, register, authenticate
} catch (err) {
  if (err instanceof AuthError) {
    err.name; // REGISTER_ERROR' | 'LOGIN_ERROR' | 'AUTHENTICATE_ERROR
    err.message; // string
    err.cause; // any
  }
}
```
