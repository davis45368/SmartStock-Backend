import { afterEach, describe, expect, it } from 'vitest';
import {
  buildDatabaseConnectionCandidates,
  extractProjectRef,
  resolveDatabaseUrl,
} from '../../src/infrastructure/database/resolveDatabaseUrl';

describe('resolveDatabaseUrl', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('extrae project ref de SUPABASE_URL', () => {
    expect(extractProjectRef('https://ppkyeiirvequmwfnzxlv.supabase.co')).toBe(
      'ppkyeiirvequmwfnzxlv'
    );
  });

  it('incluye pooler por región y por ref del proyecto', () => {
    const urls = buildDatabaseConnectionCandidates('ppkyeiirvequmwfnzxlv', 'secret');
    expect(urls.some((u) => u.includes('ppkyeiirvequmwfnzxlv.pooler.supabase.com'))).toBe(
      true
    );
    expect(urls.some((u) => u.includes('aws-1-us-west-2.pooler.supabase.com'))).toBe(
      true
    );
    expect(urls.some((u) => u.includes('aws-0-us-west-2.pooler.supabase.com'))).toBe(
      true
    );
    expect(urls.some((u) => u.includes('db.ppkyeiirvequmwfnzxlv.supabase.co'))).toBe(
      true
    );
  });

  it('usa DATABASE_URL si está definida como primer candidato', () => {
    process.env.DATABASE_URL = 'postgresql://custom/url';
    process.env.SUPABASE_URL = 'https://ppkyeiirvequmwfnzxlv.supabase.co';
    process.env.SUPABASE_DB_PASSWORD = 'secret';

    const urls = buildDatabaseConnectionCandidates('ppkyeiirvequmwfnzxlv', 'secret');
    expect(urls[0]).toBe('postgresql://custom/url');
    expect(resolveDatabaseUrl()).toBe('postgresql://custom/url');
  });
});
