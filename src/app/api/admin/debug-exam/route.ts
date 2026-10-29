import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();

    // Get all questions grouped by round
    const questionsRes = await db.execute(sql`SELECT id, round, correct_option_index, options FROM exam_questions ORDER BY round;`);
    const allQuestions = (questionsRes.rows || questionsRes) as any[];
    const d1QuestionIds = new Set(allQuestions.filter(q => (q.round || 'round1_day1') === 'round1_day1').map(q => q.id));
    const d2QuestionIds = new Set(allQuestions.filter(q => q.round === 'round1_day2').map(q => q.id));

    // Get all attempts with their full answers
    const attemptsRes = await db.execute(sql`
      SELECT ea.id, ea.score, ea.round1_score, ea.r1_d2_score, ea.answers, r.name, r.email
      FROM exam_attempts ea
      LEFT JOIN registrations r ON r.id = ea.registration_id
      WHERE ea.answers IS NOT NULL
      ORDER BY r.name;
    `);
    const attempts = (attemptsRes.rows || attemptsRes) as any[];

    const recovery: any[] = [];
    let totalRecoverable = 0;

    for (const att of attempts) {
      const userAnswers = (typeof att.answers === 'object' && att.answers) ? att.answers : {};
      const answerKeys = Object.keys(userAnswers);
      
      // Check if any answer keys match R1D1 questions
      const d1AnswerKeys = answerKeys.filter(k => d1QuestionIds.has(k));
      const d2AnswerKeys = answerKeys.filter(k => d2QuestionIds.has(k));

      if (d1AnswerKeys.length > 0 && att.score === null && att.round1_score === null) {
        // We can recover R1D1 score!
        const d1Questions = allQuestions.filter(q => (q.round || 'round1_day1') === 'round1_day1');
        let d1Score = 0;
        for (const q of d1Questions) {
          if (userAnswers[q.id] !== undefined) {
            const correctText = Array.isArray(q.options) ? q.options[q.correct_option_index] : null;
            if (userAnswers[q.id] === correctText) d1Score++;
          }
        }
        totalRecoverable++;
        recovery.push({
          name: att.name,
          email: att.email,
          d1AnswersFound: d1AnswerKeys.length,
          d2AnswersFound: d2AnswerKeys.length,
          calculatedR1D1Score: d1Score,
          currentR1D2Score: att.r1_d2_score,
          totalAnswerKeys: answerKeys.length,
        });
      }
    }

    return NextResponse.json({
      success: true,
      questionCounts: {
        round1_day1: d1QuestionIds.size,
        round1_day2: d2QuestionIds.size,
      },
      totalAttempts: attempts.length,
      recoverableR1D1Count: totalRecoverable,
      recoverable: recovery,
      message: totalRecoverable > 0 
        ? `Found ${totalRecoverable} students whose R1D1 scores can be recovered from answers!`
        : 'No R1D1 answers found in any attempt. R1D1 answers were wiped by the old unblock code. You will need to manually re-enter R1D1 scores.'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
