import { db } from './src/db/index.ts';
import { examAttempts } from './src/db/schema.ts';

async function check() {
  const data = await db.select().from(examAttempts).limit(5);
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}

check();
