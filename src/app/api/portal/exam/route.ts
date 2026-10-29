import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { examSettings, examAttempts, examQuestions, registrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const userRegs = await db.select().from(registrations).where(eq(registrations.email, session.user.email));
    if (userRegs.length === 0) return NextResponse.json({ success: false, error: 'No registration' }, { status: 400 });
    const reg = userRegs[0];

    // Check Exam Settings
    const settings = await db.select().from(examSettings).where(eq(examSettings.id, 'default')).limit(1);
    if (settings.length === 0 || !settings[0].examActive) {
      return NextResponse.json({ success: false, error: 'Exam is not active.' }, { status: 403 });
    }

    const { warningLimit, durationMinutes, activeTestRound } = settings[0];

    // Get or Create Attempt
    let attempts = await db.select().from(examAttempts).where(eq(examAttempts.registrationId, reg.id)).limit(1);
    let attempt;

    if (attempts.length === 0) {
      const newAttemptId = `ea_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await db.insert(examAttempts).values({
        id: newAttemptId,
        registrationId: reg.id,
        status: 'in_progress',
        round: activeTestRound,
        startedAt: new Date(),
      });
      attempts = await db.select().from(examAttempts).where(eq(examAttempts.id, newAttemptId));
    }
    attempt = attempts[0];

    const isDay2 = activeTestRound === 'round1_day2';
    const day1Done = (attempt.score !== null && attempt.score !== undefined) || (attempt.round1Score !== null && attempt.round1Score !== undefined);
    const day2Done = attempt.r1d2Score !== null && attempt.r1d2Score !== undefined;

    // Check if participant already finished the ACTIVE test round
    if (isDay2 && day2Done) {
      return NextResponse.json({ success: false, error: 'Round 1 (Day 2) exam already completed.' }, { status: 403 });
    }
    if (!isDay2 && day1Done) {
      return NextResponse.json({ success: false, error: 'Round 1 (Day 1) exam already completed.' }, { status: 403 });
    }

    if (attempt.status === 'terminated' && attempt.round === activeTestRound) {
      return NextResponse.json({ success: false, error: 'Exam was terminated due to anti-cheat violations.' }, { status: 403 });
    }

    // Transition attempt to in_progress for this round (without deleting previous round scores)
    if (attempt.round !== activeTestRound || attempt.status === 'not_started' || attempt.status === 'completed') {
      await db.update(examAttempts).set({
        status: 'in_progress',
        startedAt: new Date(),
        round: activeTestRound,
        warningsCount: 0,
      }).where(eq(examAttempts.id, attempt.id));
      attempt.status = 'in_progress';
      attempt.startedAt = new Date();
      attempt.round = activeTestRound;
      attempt.warningsCount = 0;
    }

    // Fetch questions filtered by the active round
    const rawQuestions = await db.select().from(examQuestions).where(eq(examQuestions.round, activeTestRound));
    
    // Jumble the questions array
    const jumbledQuestions = shuffleArray(rawQuestions).map(q => {
      // Jumble options
      const optionsList = Array.isArray(q.options) ? q.options : [];
      return {
        id: q.id,
        questionText: q.questionText,
        options: shuffleArray(optionsList),
      };
    });

    return NextResponse.json({
      success: true,
      attempt,
      questions: jumbledQuestions,
      warningLimit,
      durationMinutes,
      serverTime: Date.now()
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const userRegs = await db.select().from(registrations).where(eq(registrations.email, session.user.email));
    if (userRegs.length === 0) return NextResponse.json({ success: false, error: 'No registration' }, { status: 400 });
    const reg = userRegs[0];

    const attempts = await db.select().from(examAttempts).where(eq(examAttempts.registrationId, reg.id)).limit(1);
    if (attempts.length === 0) return NextResponse.json({ success: false, error: 'No attempt found' }, { status: 400 });
    const attempt = attempts[0];

    // Get active round from settings
    const settingsList = await db.select().from(examSettings).where(eq(examSettings.id, 'default')).limit(1);
    const activeRound = settingsList[0]?.activeTestRound || 'round1_day1';
    const isDay2 = activeRound === 'round1_day2';

    // Verify active round is not already completed
    if (isDay2 && attempt.r1d2Score !== null && attempt.r1d2Score !== undefined) {
      return NextResponse.json({ success: false, error: 'Round 1 (Day 2) exam already completed.' }, { status: 403 });
    }
    if (!isDay2 && ((attempt.score !== null && attempt.score !== undefined) || (attempt.round1Score !== null && attempt.round1Score !== undefined))) {
      return NextResponse.json({ success: false, error: 'Round 1 (Day 1) exam already completed.' }, { status: 403 });
    }

    if (attempt.status === 'terminated' && attempt.round === activeRound) {
      return NextResponse.json({ success: false, error: 'Exam was terminated.' }, { status: 403 });
    }

    const { action, payload } = await req.json();

    if (action === 'log_violation') {
      const limit = settingsList[0]?.warningLimit || 3;

      const newWarningsCount = attempt.warningsCount + 1;
      const logs: any[] = Array.isArray(attempt.violationLogs) ? attempt.violationLogs : [];
      logs.push({ time: new Date().toISOString(), reason: payload.reason, round: activeRound });

      const updates: any = {
        warningsCount: newWarningsCount,
        violationLogs: logs,
      };

      let terminated = false;
      if (newWarningsCount > limit) {
        updates.status = 'terminated';
        updates.endedAt = new Date();
        terminated = true;
      }

      await db.update(examAttempts).set(updates).where(eq(examAttempts.id, attempt.id));
      return NextResponse.json({ success: true, terminated, newWarningsCount });
    }

    if (action === 'submit_answers' || action === 'auto_submit') {
      const userAnswers = payload.answers || {}; // { questionId: selectedText }
      
      // Calculate score - only count questions from the active round
      const rawQuestions = await db.select().from(examQuestions).where(eq(examQuestions.round, activeRound));
      let score = 0;

      for (const q of rawQuestions) {
        const correctText = Array.isArray(q.options) ? q.options[q.correctOptionIndex] : null;
        if (userAnswers[q.id] === correctText) {
          score += 1;
        }
      }

      // Merge answers so Day 1 answers are NOT erased by Day 2 answers
      const existingAnswers = (attempt.answers && typeof attempt.answers === 'object') ? attempt.answers : {};
      const mergedAnswers = { ...existingAnswers, ...userAnswers };

      const updates: any = {
        answers: mergedAnswers,
        status: 'completed',
        endedAt: new Date(),
        round: activeRound
      };
      
      if (isDay2) {
        updates.r1d2Score = score;
      } else {
        updates.score = score;
        updates.round1Score = score;
      }

      await db.update(examAttempts).set(updates).where(eq(examAttempts.id, attempt.id));

      return NextResponse.json({ success: true, score });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
