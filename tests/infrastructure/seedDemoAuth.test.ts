import { describe, expect, it } from 'vitest';
import {
  DEFAULT_DEMO_EMAIL,
  DEFAULT_DEMO_PASSWORD,
  getDemoCredentials,
} from '../../src/infrastructure/database/seedDemoAuth';

describe('seedDemoAuth', () => {
  it('expone credenciales demo por defecto', () => {
    const originalEmail = process.env.DEMO_USER_EMAIL;
    const originalPassword = process.env.DEMO_USER_PASSWORD;
    delete process.env.DEMO_USER_EMAIL;
    delete process.env.DEMO_USER_PASSWORD;

    const creds = getDemoCredentials();
    expect(creds.email).toBe(DEFAULT_DEMO_EMAIL);
    expect(creds.password).toBe(DEFAULT_DEMO_PASSWORD);

    process.env.DEMO_USER_EMAIL = originalEmail;
    process.env.DEMO_USER_PASSWORD = originalPassword;
  });
});
