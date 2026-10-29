import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST: Bulk import R1D1 scores
// Body: { scores: [{ email: "...", score: 5 }, ...] }
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { scores } = body;

    if (!Array.isArray(scores) || scores.length === 0) {
      return NextResponse.json({ success: false, error: 'Provide an array of { email, score } objects.' }, { status: 400 });
    }

    let updated = 0;
    let notFound: string[] = [];
    let errors: string[] = [];

    for (const item of scores) {
      const { email, score } = item;
      if (!email || score === undefined || score === null) {
        errors.push(`Invalid entry: ${JSON.stringify(item)}`);
        continue;
      }

      const numScore = Number(score);
      if (isNaN(numScore)) {
        errors.push(`Invalid score for ${email}: ${score}`);
        continue;
      }

      // Find the registration by email
      const regRes = await db.execute(sql`SELECT id FROM registrations WHERE LOWER(email) = LOWER(${email}) LIMIT 1;`);
      const regs = (regRes.rows || regRes) as any[];
      
      if (regs.length === 0) {
        notFound.push(email);
        continue;
      }

      const regId = regs[0].id;

      // Find existing attempt
      const attRes = await db.execute(sql`SELECT id FROM exam_attempts WHERE registration_id = ${regId} LIMIT 1;`);
      const atts = (attRes.rows || attRes) as any[];

      if (atts.length > 0) {
        // Update existing attempt
        await db.execute(sql`
          UPDATE exam_attempts 
          SET score = ${numScore}, round1_score = ${numScore} 
          WHERE id = ${atts[0].id};
        `);
      } else {
        // Create new attempt with score
        await db.execute(sql`
          INSERT INTO exam_attempts (id, registration_id, status, score, round1_score, round, started_at) 
          VALUES (gen_random_uuid(), ${regId}, 'completed', ${numScore}, ${numScore}, 'round1_day1', NOW());
        `);
      }
      updated++;
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updated} scores.`,
      updated,
      notFound,
      errors,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
