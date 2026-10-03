import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    
    // Execute migrations directly on the database
    await db.execute(sql`ALTER TABLE exam_settings ADD COLUMN IF NOT EXISTS active_test_round TEXT NOT NULL DEFAULT 'round1_day1';`);
    await db.execute(sql`ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS round TEXT NOT NULL DEFAULT 'round1_day1';`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS exam_questions_round_idx ON exam_questions (round);`);
    await db.execute(sql`ALTER TABLE exam_attempts ADD COLUMN IF NOT EXISTS round1_score INTEGER;`);
    await db.execute(sql`ALTER TABLE exam_attempts ADD COLUMN IF NOT EXISTS r1_d2_score INTEGER;`);
    await db.execute(sql`ALTER TABLE exam_attempts ADD COLUMN IF NOT EXISTS round TEXT NOT NULL DEFAULT 'round1_day1';`);

    return NextResponse.json({ success: true, message: 'Database schema successfully updated!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
