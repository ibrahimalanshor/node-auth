import  { describe, test, expect } from '@jest/globals'
import { Auth, RegisterCredential } from '../src/auth'
import { AuthError } from '../src/errors/auth.error'

describe('auth test', () => {
    test('auth class must have register method', () => {
        expect(Auth.prototype).toHaveProperty('register')
    })
    
    test('register method must return register error when crete user error', async () => {
        class TestAuth extends Auth {
            protected async createUser(credential: RegisterCredential): Promise<any> {
                throw new Error('user is already registered')
            }
        }
        const testAuth = new TestAuth

        try {
            await testAuth.register({ email: 'test@gmail.com', password: 'password' })
        } catch (err) {
            expect(err).toBeInstanceOf(AuthError)
            expect((err as AuthError).message).toMatch('user is already registered')
        }
    })
})