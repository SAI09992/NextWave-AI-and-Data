import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eventSettings } from './src/db/schema';

async function main() {
  const sql = neon('postgresql://neondb_owner:npg_saImytW7gBv2@ep-broad-mouse-axoror0q-pooler.c-4.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require&connect_timeout=30&pool_timeout=30&connection_limit=5');
  const db = drizzle(sql);

  console.log('Updating event name in the live production database...');
  await db.update(eventSettings).set({ eventName: 'NextWave AI And Data' });
  console.log('Successfully updated the production database!');
}

main().catch(console.error);
