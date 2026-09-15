import { db } from './src/db/index';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`UPDATE payments SET amount = 200, "expectedAmount" = 200 WHERE amount = 300 OR "expectedAmount" = 300;`);
  console.log('Fixed all 300 amounts');
  process.exit(0);
}

main();
