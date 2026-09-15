import { db } from './src/db/index';
import { payments } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  await db.update(payments).set({ amount: 200, expectedAmount: 200 }).where(eq(payments.utr, '154323969645'));
  console.log('Updated Dhanush payment');
  process.exit(0);
}

main();
