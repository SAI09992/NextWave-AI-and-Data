import { neon } from '@neondatabase/serverless';

async function migrateDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL not found');
  }
  const sql = neon(connectionString);

  console.log('Adding registration_fee...');
  try {
    await sql`ALTER TABLE "event_settings" ADD COLUMN "registration_fee" integer DEFAULT 200 NOT NULL`;
    console.log('Added registration_fee');
  } catch (e: any) {
    console.log(e.message);
  }

  console.log('Adding countdown_target...');
  try {
    await sql`ALTER TABLE "event_settings" ADD COLUMN "countdown_target" varchar DEFAULT '2026-08-29T09:00:00+05:30'`;
    console.log('Added countdown_target');
  } catch (e: any) {
    console.log(e.message);
  }

  console.log('Dropping old columns...');
  try {
    await sql`ALTER TABLE "event_settings" DROP COLUMN "registration_fee_ue"`;
    console.log('Dropped registration_fee_ue');
  } catch (e: any) {
    console.log(e.message);
  }

  try {
    await sql`ALTER TABLE "event_settings" DROP COLUMN "registration_fee_other"`;
    console.log('Dropped registration_fee_other');
  } catch (e: any) {
    console.log(e.message);
  }
  
  console.log('Done!');
}

migrateDb();
