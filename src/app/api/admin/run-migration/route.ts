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

    // Sync round1_score and score so no marks are lost between column naming differences
    await db.execute(sql`UPDATE exam_attempts SET score = round1_score WHERE score IS NULL AND round1_score IS NOT NULL;`);
    await db.execute(sql`UPDATE exam_attempts SET round1_score = score WHERE round1_score IS NULL AND score IS NOT NULL;`);

    // Recalculate and recover scores from answers JSON for any attempt that lost scores
    const questionsRes = await db.execute(sql`SELECT id, correct_option_index, options, round FROM exam_questions;`);
    const allQuestions = (questionsRes.rows || questionsRes) as any[];

    const attemptsRes = await db.execute(sql`SELECT id, score, round1_score, r1_d2_score, answers FROM exam_attempts WHERE answers IS NOT NULL;`);
    const attempts = (attemptsRes.rows || attemptsRes) as any[];

    let recoveredCount = 0;
    for (const att of attempts) {
      const userAnswers = (typeof att.answers === 'object' && att.answers) ? att.answers : {};
      const answerKeys = Object.keys(userAnswers);
      if (answerKeys.length === 0) continue;

      let recoveredR1D1: number | null = null;
      let recoveredR1D2: number | null = null;

      // Check R1D1 questions
      if (att.score === null && att.round1_score === null) {
        const d1Questions = allQuestions.filter(q => (q.round || 'round1_day1') === 'round1_day1');
        let d1Score = 0;
        let d1Answered = 0;
        for (const q of d1Questions) {
          if (userAnswers[q.id] !== undefined) {
            d1Answered++;
            const correctText = Array.isArray(q.options) ? q.options[q.correct_option_index] : null;
            if (userAnswers[q.id] === correctText) d1Score++;
          }
        }
        if (d1Answered > 0) recoveredR1D1 = d1Score;
      }

      // Check R1D2 questions
      if (att.r1_d2_score === null) {
        const d2Questions = allQuestions.filter(q => q.round === 'round1_day2');
        let d2Score = 0;
        let d2Answered = 0;
        for (const q of d2Questions) {
          if (userAnswers[q.id] !== undefined) {
            d2Answered++;
            const correctText = Array.isArray(q.options) ? q.options[q.correct_option_index] : null;
            if (userAnswers[q.id] === correctText) d2Score++;
          }
        }
        if (d2Answered > 0) recoveredR1D2 = d2Score;
      }

      if (recoveredR1D1 !== null || recoveredR1D2 !== null) {
        recoveredCount++;
        if (recoveredR1D1 !== null && recoveredR1D2 !== null) {
          await db.execute(sql`UPDATE exam_attempts SET score = ${recoveredR1D1}, round1_score = ${recoveredR1D1}, r1_d2_score = ${recoveredR1D2} WHERE id = ${att.id};`);
        } else if (recoveredR1D1 !== null) {
          await db.execute(sql`UPDATE exam_attempts SET score = ${recoveredR1D1}, round1_score = ${recoveredR1D1} WHERE id = ${att.id};`);
        } else if (recoveredR1D2 !== null) {
          await db.execute(sql`UPDATE exam_attempts SET r1_d2_score = ${recoveredR1D2} WHERE id = ${att.id};`);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Database schema updated and synchronized! Recovered scores for ${recoveredCount} student attempts.` 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
