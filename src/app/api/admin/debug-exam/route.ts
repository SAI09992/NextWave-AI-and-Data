import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();

    // Raw query to see exactly what's in the database
    const attemptsRes = await db.execute(sql`
      SELECT 
        ea.id,
        ea.registration_id,
        ea.status,
        ea.round,
        ea.score,
        ea.round1_score,
        ea.r1_d2_score,
        ea.round2_score,
        ea.round3_score,
        ea.answers IS NOT NULL as has_answers,
        CASE WHEN ea.answers::text = '{}' THEN true ELSE false END as answers_empty,
        r.name,
        r.email
      FROM exam_attempts ea
      LEFT JOIN registrations r ON r.id = ea.registration_id
      ORDER BY r.name
      LIMIT 100;
    `);

    const rows = (attemptsRes.rows || attemptsRes) as any[];

    // Summary stats
    const total = rows.length;
    const withScore = rows.filter(r => r.score !== null).length;
    const withRound1Score = rows.filter(r => r.round1_score !== null).length;
    const withR1D2Score = rows.filter(r => r.r1_d2_score !== null).length;
    const bothNull = rows.filter(r => r.score === null && r.round1_score === null).length;

    return NextResponse.json({
      success: true,
      summary: {
        totalAttempts: total,
        withScore: withScore,
        withRound1Score: withRound1Score,
        withR1D2Score: withR1D2Score,
        bothScoreAndRound1ScoreNull: bothNull,
      },
      attempts: rows.map(r => ({
        name: r.name,
        email: r.email,
        status: r.status,
        round: r.round,
        score: r.score,
        round1_score: r.round1_score,
        r1_d2_score: r.r1_d2_score,
        round2_score: r.round2_score,
        has_answers: r.has_answers,
        answers_empty: r.answers_empty,
      }))
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
