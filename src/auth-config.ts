import { SignOptions, Secret } from 'jsonwebtoken';

export default new (class AuthConfig {
  private secret: Secret;
  private options: SignOptions;

  public setSecret(secret: Secret): this {
    this.secret = secret;

    return this;
  }

  public setOptions(options: SignOptions): this {
    this.options = options;

    return this;
  }

  public getSecret(): Secret {
    return this.secret;
  }

  public getOptions(): SignOptions {
    return this.options;
  }
})();
