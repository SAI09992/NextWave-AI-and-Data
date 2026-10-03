import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/db';
import { examAttempts, registrations } from '@/db/schema';
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

    return NextResponse.json({ success: true, attempts: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { attemptId, action, score, r1d2Score, round2Score, round3Score } = body;

    if (action === 'unblock') {
      await db.update(examAttempts).set({
        status: 'not_started',
        warningsCount: 0,
        startedAt: null,
        endedAt: null,
        score: null,
        answers: {}
      }).where(eq(examAttempts.id, attemptId));
      
      return NextResponse.json({ success: true, message: 'User unblocked and attempt reset.' });
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
        const currentStatus = existingAttempt[0]?.status;
        
        const updateData: any = {
          score: r1d1,
          r1d2Score: r1d2,
          round2Score: r2,
          round3Score: r3
        };
        
        // If student hasn't attempted and we're adding marks, mark as completed
        if (currentStatus === 'not_started' && (r1d1 !== null || r1d2 !== null || r2 !== null || r3 !== null)) {
          updateData.status = 'completed';
          updateData.endedAt = new Date();
        }
        
        await db.update(examAttempts).set(updateData).where(eq(examAttempts.id, attemptId));
      } else {
        // Create an attempt row for this user to store marks
        // Status is set to 'completed' so they cannot take the test
        const { v4: uuidv4 } = require('uuid');
        await db.insert(examAttempts).values({
          id: uuidv4(),
          registrationId: internalRegId,
          status: (r1d1 !== null || r1d2 !== null || r2 !== null || r3 !== null) ? 'completed' : 'not_started',
          score: r1d1,
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
