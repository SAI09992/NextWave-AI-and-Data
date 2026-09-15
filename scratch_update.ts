import { db } from './src/db/index';
import { eventSettings } from './src/db/schema';

async function main() {
  await db.update(eventSettings).set({ registrationFee: 200 });
  console.log('Fee updated to 200');
  process.exit(0);
}

main();
