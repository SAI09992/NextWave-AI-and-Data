import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const rawUrl = process.env.DATABASE_URL?.trim();
const connectionString =
  (rawUrl && rawUrl.length > 5 ? rawUrl : null) ||
  'postgresql://neondb_owner:npg_G9OX6JTuKnYC@ep-floral-sky-avnwvdc1.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require';

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
