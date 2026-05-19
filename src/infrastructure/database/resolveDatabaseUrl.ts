const POOLER_REGIONS = [
  'us-west-2',
  'us-east-1',
  'us-west-1',
  'us-east-2',
  'eu-west-1',
  'eu-central-1',
  'ap-southeast-1',
  'sa-east-1',
];

const POOLER_PREFIXES = ['aws-1', 'aws-0'];

function poolerUrls(
  projectRef: string,
  encodedPassword: string,
  region: string
): string[] {
  const urls: string[] = [];

  for (const prefix of POOLER_PREFIXES) {
    const host = `${prefix}-${region}.pooler.supabase.com`;
    urls.push(
      `postgresql://postgres.${projectRef}:${encodedPassword}@${host}:5432/postgres`,
      `postgresql://postgres.${projectRef}:${encodedPassword}@${host}:6543/postgres`,
      `postgresql://postgres:${encodedPassword}@${host}:5432/postgres`
    );
  }

  return urls;
}

export function extractProjectRef(supabaseUrl: string): string | null {
  try {
    return new URL(supabaseUrl).hostname.split('.')[0] || null;
  } catch {
    return null;
  }
}

export function buildDatabaseConnectionCandidates(
  projectRef: string,
  password: string
): string[] {
  const enc = encodeURIComponent(password);
  const candidates: string[] = [];

  if (process.env.DATABASE_URL?.trim()) {
    candidates.push(process.env.DATABASE_URL.trim());
  }

  const explicitRegion = process.env.SUPABASE_DB_REGION?.trim();
  if (explicitRegion) {
    candidates.push(...poolerUrls(projectRef, enc, explicitRegion));
  }

  candidates.push(
    `postgresql://postgres:${enc}@db.${projectRef}.supabase.co:5432/postgres`,
    `postgresql://postgres.${projectRef}:${enc}@${projectRef}.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.${projectRef}:${enc}@${projectRef}.pooler.supabase.com:6543/postgres`
  );

  for (const region of POOLER_REGIONS) {
    candidates.push(...poolerUrls(projectRef, enc, region));
  }

  return [...new Set(candidates)];
}

export function resolveDatabaseUrl(): string | null {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const dbPassword = process.env.SUPABASE_DB_PASSWORD?.trim();

  if (!supabaseUrl || !dbPassword) {
    return null;
  }

  const projectRef = extractProjectRef(supabaseUrl);
  if (!projectRef) {
    return null;
  }

  const candidates = buildDatabaseConnectionCandidates(projectRef, dbPassword);
  return candidates[0] ?? null;
}
