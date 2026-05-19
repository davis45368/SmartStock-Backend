import dotenv from 'dotenv';
import pg from 'pg';
import {
  buildDatabaseConnectionCandidates,
  extractProjectRef,
} from './resolveDatabaseUrl';

dotenv.config();

const { Client } = pg;

const MIGRATION_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    stock_actual INT NOT NULL CHECK (stock_actual >= 0),
    venta_promedio_diaria INT NOT NULL DEFAULT 0,
    lead_time INT NOT NULL DEFAULT 1,
    stock_seguridad INT NOT NULL DEFAULT 0,
    supplier VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
  )`,
  `CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity_ordered INT NOT NULL CHECK (quantity_ordered > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    supplier VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
  )`,
];

const CONNECT_TIMEOUT_MS = 10000;

function isAutoMigrateEnabled(): boolean {
  return process.env.AUTO_MIGRATE !== 'false';
}

function maskConnectionString(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.password) parsed.password = '****';
    return `${parsed.hostname}:${parsed.port}`;
  } catch {
    return '[host]';
  }
}

async function tryMigrateWithUrl(connectionString: string): Promise<boolean> {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: CONNECT_TIMEOUT_MS,
  });

  try {
    await client.connect();

    for (const statement of MIGRATION_STATEMENTS) {
      await client.query(statement);
    }

    return true;
  } finally {
    await client.end().catch(() => undefined);
  }
}

export async function ensureDatabaseSchema(): Promise<boolean> {
  if (!isAutoMigrateEnabled()) {
    console.log('[MIGRATE] Migración automática deshabilitada (AUTO_MIGRATE=false).');
    return false;
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const dbPassword = process.env.SUPABASE_DB_PASSWORD?.trim();

  if (!supabaseUrl || !dbPassword) {
    console.error('[MIGRATE] Faltan SUPABASE_URL o SUPABASE_DB_PASSWORD en .env');
    return false;
  }

  const projectRef = extractProjectRef(supabaseUrl);
  if (!projectRef) {
    console.error('[MIGRATE] SUPABASE_URL inválida:', supabaseUrl);
    return false;
  }

  const region = process.env.SUPABASE_DB_REGION?.trim() ?? 'us-west-2';
  const candidates = buildDatabaseConnectionCandidates(projectRef, dbPassword);

  console.log(
    `[MIGRATE] Proyecto ${projectRef} (región ${region}) — ${candidates.length} formatos de conexión...`
  );

  const errors: string[] = [];

  for (const connectionString of candidates) {
    try {
      const ok = await tryMigrateWithUrl(connectionString);
      if (ok) {
        console.log('[MIGRATE] ✓ Tablas products y orders listas.');
        console.log(`[MIGRATE]   Host usado: ${maskConnectionString(connectionString)}`);
        return true;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${maskConnectionString(connectionString)} → ${message}`);

      if (errors.length <= 6) {
        console.warn(`[MIGRATE] Falló ${maskConnectionString(connectionString)}: ${message}`);
      }
    }
  }

  console.error('[MIGRATE] No se pudo conectar con ningún formato automático.');
  console.error(
    '[MIGRATE] Solución rápida: Supabase → Connect → copia la URI "Session" o "Transaction"'
  );
  console.error('[MIGRATE] y añádela en Backend/.env como DATABASE_URL=postgresql://...');
  console.error(
    '[MIGRATE] Alternativa: SQL Editor → pega y ejecuta Backend/sql/init.sql'
  );
  return false;
}
