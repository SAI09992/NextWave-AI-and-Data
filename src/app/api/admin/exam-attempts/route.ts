import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/db';
import { examAttempts, registrations, examSettings } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    
    const data = await db
      .select({
        id: examAttempts.id,
        status: examAttempts.status,
        score: examAttempts.score,
        round1Score: examAttempts.round1Score,
        r1d2Score: examAttempts.r1d2Score,
        warningsCount: examAttempts.warningsCount,
        violationLogs: examAttempts.violationLogs,
        round2Score: examAttempts.round2Score,
        round3Score: examAttempts.round3Score,
        round: examAttempts.round,
        startedAt: examAttempts.startedAt,
        endedAt: examAttempts.endedAt,
        registrationId: registrations.registrationId,
        internalRegId: registrations.id,
        name: registrations.name,
        email: registrations.email,
        phone: registrations.phone
      })
      .from(registrations)
      .leftJoin(examAttempts, eq(registrations.id, examAttempts.registrationId))
      .orderBy(desc(registrations.createdAt));

    // Fallback: If score is null but round1Score exists, use round1Score
    const normalizedData = data.map(attempt => ({
      ...attempt,
      score: attempt.score !== null && attempt.score !== undefined ? attempt.score : (attempt.round1Score !== null && attempt.round1Score !== undefined ? attempt.round1Score : null)
    }));

    return NextResponse.json({ success: true, attempts: normalizedData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { attemptId, action, score, r1d2Score, round2Score, round3Score, roundToReset } = body;

    if (action === 'unblock') {
      const existing = await db.select().from(examAttempts).where(eq(examAttempts.id, attemptId)).limit(1);
      const att = existing[0];

      // Get active round if roundToReset was not explicitly passed
      let targetRound = roundToReset;
      if (!targetRound) {
        const settings = await db.select().from(examSettings).where(eq(examSettings.id, 'default')).limit(1);
        targetRound = settings[0]?.activeTestRound || 'round1_day1';
      }

      const updateData: any = {
        status: 'not_started',
        warningsCount: 0,
        startedAt: null,
        endedAt: null,
      };

      // If just unblocking from terminated state without wiping scores, keep scores intact.
      // If resetting, only reset the targeted round, NEVER wipe other rounds!
      if (att?.status === 'terminated') {
        // Just unblock so cadet can take the test
        updateData.status = 'not_started';
      } else {
        if (targetRound === 'round1_day2') {
          updateData.r1d2Score = null;
        } else {
          updateData.score = null;
          updateData.round1Score = null;
        }
      }

      await db.update(examAttempts).set(updateData).where(eq(examAttempts.id, attemptId));
      
      return NextResponse.json({ success: true, message: 'User unblocked and attempt reset successfully.' });
    }

    if (action === 'update_marks') {
      const { internalRegId } = body;
      
      const r1d1 = score === '' || score === undefined ? null : Number(score);
      const r1d2 = r1d2Score === '' || r1d2Score === undefined ? null : Number(r1d2Score);
      const r2 = round2Score === '' || round2Score === undefined ? null : Number(round2Score);
      const r3 = round3Score === '' || round3Score === undefined ? null : Number(round3Score);

      if (attemptId) {
        // Check current attempt status
        const existingAttempt = await db.select().from(examAttempts).where(eq(examAttempts.id, attemptId)).limit(1);
        const existing = existingAttempt[0];
        const currentStatus = existing?.status;
        
        const existingR1 = existing?.score ?? existing?.round1Score ?? null;
        const finalR1 = (score === undefined) ? existingR1 : (score === '' ? null : Number(score));
        const finalR1D2 = (r1d2Score === undefined) ? existing?.r1d2Score : (r1d2Score === '' ? null : Number(r1d2Score));
        const finalR2 = (round2Score === undefined) ? existing?.round2Score : (round2Score === '' ? null : Number(round2Score));
        const finalR3 = (round3Score === undefined) ? existing?.round3Score : (round3Score === '' ? null : Number(round3Score));

        const updateData: any = {
          score: finalR1,
          round1Score: finalR1,
          r1d2Score: finalR1D2,
          round2Score: finalR2,
          round3Score: finalR3
        };
        
        // If student hasn't attempted and we're adding marks, mark as completed
        if (currentStatus === 'not_started' && (finalR1 !== null || finalR1D2 !== null || finalR2 !== null || finalR3 !== null)) {
          updateData.status = 'completed';
          updateData.endedAt = new Date();
        }
        
        await db.update(examAttempts).set(updateData).where(eq(examAttempts.id, attemptId));
      } else {
        // Create an attempt row for this user to store marks
        const { v4: uuidv4 } = require('uuid');
        await db.insert(examAttempts).values({
          id: uuidv4(),
          registrationId: internalRegId,
          status: (r1d1 !== null || r1d2 !== null || r2 !== null || r3 !== null) ? 'completed' : 'not_started',
          score: r1d1,
          round1Score: r1d1,
          r1d2Score: r1d2,
          round2Score: r2,
          round3Score: r3,
          endedAt: (r1d1 !== null || r1d2 !== null || r2 !== null || r3 !== null) ? new Date() : null,
        });
      }
      
      return NextResponse.json({ success: true, message: 'Marks updated successfully.' });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
