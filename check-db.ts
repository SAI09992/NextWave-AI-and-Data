import { db } from './src/db';
import { eventSettings } from './src/db/schema';

async function main() {
  const settings = await db.select().from(eventSettings).limit(1);
  console.log('Current DB Settings:', settings);
}

main().catch(console.error);
