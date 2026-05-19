import { supabase } from '../config/supabase';

export const DEFAULT_DEMO_EMAIL = 'admin@smartstock.com';
export const DEFAULT_DEMO_PASSWORD = 'SmartStock2024!';

function isSeedEnabled(): boolean {
  return process.env.SEED_DEMO_DATA !== 'false';
}

export function getDemoCredentials(): { email: string; password: string } {
  return {
    email: process.env.DEMO_USER_EMAIL ?? DEFAULT_DEMO_EMAIL,
    password: process.env.DEMO_USER_PASSWORD ?? DEFAULT_DEMO_PASSWORD,
  };
}

async function demoUserExists(email: string): Promise<boolean> {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.users.some(
    (user) => user.email?.toLowerCase() === email.toLowerCase()
  );
}

export async function seedDemoAuthUser(): Promise<void> {
  if (!isSeedEnabled()) {
    return;
  }

  const { email, password } = getDemoCredentials();

  console.log('[SEED] Verificando usuario de demostración...');

  try {
    const exists = await demoUserExists(email);

    if (exists) {
      console.log(`[SEED] Usuario demo ya registrado: ${email}`);
      console.log('[SEED] Credenciales para el login del frontend:');
      console.log(`[SEED]   Email:    ${email}`);
      console.log(`[SEED]   Password: ${password}`);
      return;
    }

    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'administrador', demo: true },
    });

    if (error) {
      console.error(`[SEED] Error al crear usuario demo: ${error.message}`);
      return;
    }

    console.log('[SEED] ✓ Usuario demo creado en Supabase Auth');
    console.log('[SEED] Credenciales para el login del frontend:');
    console.log(`[SEED]   Email:    ${email}`);
    console.log(`[SEED]   Password: ${password}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[SEED] Error al verificar usuarios Auth: ${message}`);
  }
}
