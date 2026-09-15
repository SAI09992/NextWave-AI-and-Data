'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ParticipantHeader from '@/components/portal/ParticipantHeader';
import StatusCard from '@/components/portal/StatusCard';
import RegistrationTimeline from '@/components/portal/RegistrationTimeline';
import AttendanceBadge from '@/components/portal/AttendanceBadge';
import { RegistrationData, PaymentData, AttendanceData, CertificateData } from '@/types';
import { Award, ArrowRight, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ParticipantPortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState<RegistrationData | null>(null);
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [attendance, setAttendance] = useState<AttendanceData[]>([]);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);

  const fetchPortalData = async () => {
    try {
      const res = await fetch('/api/portal/me');
      const data = await res.json();
      if (data.success) {
        setRegistration(data.registration);
        setPayment(data.payment);
        setAttendance(data.attendance || []);
        setCertificate(data.certificate);
      }
    } catch (err) {
      console.error('Failed to fetch portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPortalData();
    } else if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/portal');
    }
  }, [status, router]);

  // Real-time Event Listener for instant status change without refresh
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime');
      eventSource.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.event === 'payment:statusUpdated') {
            if (
              registration &&
              (payload.data.registrationId === registration.registrationId ||
                payload.data.userId === (session?.user as any)?.id)
            ) {
              setPayment((prev) =>
                prev
                  ? { ...prev, status: payload.data.status, verifiedAt: payload.data.verifiedAt }
                  : null
              );

              if (payload.data.status === 'verified') {
                if (typeof window !== 'undefined') {
                  import('canvas-confetti').then((m) =>
                    m.default({
                      particleCount: 80,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ['#00E5FF', '#10B981', '#3B82F6'],
                    })
                  );
                }
                toast.success('✓ Payment verification completed! Welcome to NextWave.');
              } else if (payload.data.status === 'rejected') {
                toast.error('Payment rejected: ' + (payload.data.rejectionReason || 'Details mismatch'));
              }
            }
          }

          if (payload.event === 'attendance:updated') {
            if (registration && payload.data.registrationId === registration.registrationId) {
              fetchPortalData();
              toast.info(`Attendance marked for Day ${payload.data.day}`);
            }
          }
        } catch (err) {
          // ignore
        }
      };
    } catch (e) {
      console.warn('Realtime SSE disconnected');
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [registration, session]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 font-mono text-cyan-400 text-sm">
          <span className="w-5 h-5 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <span>LOADING PARTICIPANT DOSSIER...</span>
        </div>
      </div>
    );
  }

  // If no registration exists for this user yet
  if (!registration) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-800 text-center space-y-6 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-gray-950 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-sans text-white">
              NO ACTIVE REGISTRATION FOUND
            </h2>
            <p className="text-sm font-sans text-gray-400 mt-2 leading-relaxed">
              You are signed in as {session?.user?.email}. You must complete the bootcamp registration form to obtain your Reference ID.
            </p>
          </div>

          <Link href="/register" className="block">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-sans transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <span>REGISTER FOR BOOTCAMP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const isVerified = payment?.status === 'verified';
  const day1Present = attendance.some((a) => a.day === 1 && a.status === 'present');
  const day2Present = attendance.some((a) => a.day === 2 && a.status === 'present');
  const isEligibleForCert = isVerified && (day1Present || day2Present);

  return (
    <div className="flex-1 py-8 px-4 bg-cyber-bg min-h-screen">
      <div className="container mx-auto max-w-5xl space-y-8 relative z-10">
        {/* Header Profile Dossier */}
        <ParticipantHeader registration={registration} />

        {/* Status Card & Attendance Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatusCard payment={payment} registrationId={registration.registrationId} />
          <AttendanceBadge
            registrationId={registration.registrationId}
            attendance={attendance}
            paymentVerified={isVerified}
          />
        </div>

        {/* Team Portal Section */}
        <TeamPortalCard />
        
        {/* Exam Portal Section */}
        <ExamPortalCard />

        {/* Certificate Unlock Banner */}
        {isEligibleForCert && (
          <div className="p-6 rounded-2xl bg-emerald-950/20 backdrop-blur-md border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  BOOTCAMP CERTIFICATE UNLOCKED
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  Your verified attendance qualifies you for cryptographic QR certification.
                </p>
              </div>
            </div>

            <Link href="/certificate">
              <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors w-full sm:w-auto shadow-lg shadow-emerald-500/20">
                <span>VIEW CERTIFICATE</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </Link>
          </div>
        )}

        {/* WhatsApp Group Join Card - visible after payment */}
        {payment && <WhatsAppJoinCard />}

        {/* Lifecycle Progression Timeline */}
        <RegistrationTimeline
          paymentStatus={payment?.status}
          attendance={attendance}
          hasCertificate={!!certificate || isEligibleForCert}
        />
      </div>
    </div>
  );
}

function WhatsAppJoinCard() {
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [whatsappQr, setWhatsappQr] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/event-stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setWhatsappLink(data.stats.whatsappGroupLink || null);
          setWhatsappQr(data.stats.whatsappGroupQrUrl || null);
        }
      })
      .catch(() => {});
  }, []);

  if (!whatsappLink) return null;

  return (
    <div className="p-6 rounded-2xl bg-emerald-950/10 backdrop-blur-md border border-emerald-500/40 space-y-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-400 flex items-center justify-center shrink-0">
          <ExternalLink className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold font-mono text-emerald-400">
            JOIN OFFICIAL WHATSAPP GROUP
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5 font-sans">
            Stay updated with announcements, schedule changes, and connect with fellow participants.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {whatsappQr && (
          <div className="w-40 h-40 rounded-xl overflow-hidden border border-emerald-500/30 bg-white p-2 shrink-0">
            <img
              src={whatsappQr}
              alt="WhatsApp Group QR Code"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <p className="text-sm text-gray-400 font-sans">
            {whatsappQr ? 'Scan the QR code or click the button below to join instantly.' : 'Click the button below to join instantly.'}
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-sans text-sm transition-all shadow-lg"
          >
            <ExternalLink className="w-4 h-4" />
            JOIN WHATSAPP GROUP
          </a>
        </div>
      </div>
    </div>
  );
}

function TeamPortalCard() {
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState<any>(null);
  const [rolling, setRolling] = useState(false);
  const [diceNumber, setDiceNumber] = useState<number | null>(null);
  const [diceAnimating, setDiceAnimating] = useState(false);
  const [rolledPS, setRolledPS] = useState<any>(null);

  useEffect(() => {
    fetch('/api/portal/team')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTeamData(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRollDice = async () => {
    setRolling(true);
    setDiceAnimating(true);

    // Animate dice numbers rapidly for 2.5 seconds
    const interval = setInterval(() => {
      setDiceNumber(Math.floor(Math.random() * 5) + 1);
    }, 100);

    try {
      const res = await fetch('/api/portal/team/roll-dice', { method: 'POST' });
      const data = await res.json();

      // Wait for animation to complete
      await new Promise((r) => setTimeout(r, 2500));
      clearInterval(interval);

      if (data.success) {
        setDiceNumber(data.rolledNumber);
        setRolledPS(data.problemStatement);
        setDiceAnimating(false);

        // Confetti!
        if (typeof window !== 'undefined') {
          import('canvas-confetti').then((m) =>
            m.default({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#3B82F6', '#8B5CF6', '#00E5FF', '#10B981'],
            })
          );
        }

        // Refresh team data
        setTimeout(() => {
          fetch('/api/portal/team')
            .then((r) => r.json())
            .then((d) => { if (d.success) setTeamData(d); });
        }, 1000);

        toast.success(`🎲 You got Problem Statement #${data.rolledNumber}: ${data.problemStatement.title}`);
      } else {
        clearInterval(interval);
        setDiceAnimating(false);
        setDiceNumber(null);
        toast.error(data.error || 'Failed to roll');
      }
    } catch (e) {
      clearInterval(interval);
      setDiceAnimating(false);
      setDiceNumber(null);
      toast.error('Network error');
    } finally {
      setRolling(false);
    }
  };

  if (loading) return null;
  if (!teamData) return null;
  if (!teamData.teamPortalVisible) return null;

  const team = teamData.team;

  if (!team) {
    return (
      <div className="p-6 rounded-2xl bg-amber-950/10 backdrop-blur-md border border-amber-500/40 font-mono text-xs text-center shadow-xl">
        <div className="text-amber-400 font-bold text-sm mb-2">⚠ NO TEAM ASSIGNED</div>
        <p className="text-gray-400 font-sans text-sm">
          You have not been assigned to a team yet. Please contact the organizers.
        </p>
      </div>
    );
  }

  const ps = team.problemStatement;
  const isLead = teamData.isTeamLead;
  const psSelectionVisible = teamData.psSelectionVisible;

  return (
    <div className="p-6 rounded-2xl bg-blue-950/10 backdrop-blur-md border border-blue-500/40 space-y-5 shadow-xl">
      {/* Team Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500 text-blue-400 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>
          </div>
          <div>
            <h3 className="text-base font-bold font-sans text-white">
              {team.teamName || 'YOUR TEAM'}
            </h3>
            <p className="text-[11px] text-gray-400 font-mono">
              {team.memberCount} Members {isLead && <span className="text-amber-400 ml-2">★ Team Lead</span>}
            </p>
          </div>
        </div>
        {ps && (
          <div className="px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold font-mono shadow-[0_0_10px_rgba(59,130,246,0.2)]">
            PS #{ps.slotNumber}
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {team.members.map((m: any) => {
          const isMemberLead = m.registrationId === team.teamLeadRegistrationId;
          return (
            <div
              key={m.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-sans ${
                isMemberLead
                  ? 'bg-amber-500/10 border border-amber-500/30'
                  : 'bg-gray-900/50 border border-gray-800'
              }`}
            >
              {isMemberLead && (
                <span className="text-amber-400 text-xs">★</span>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-white font-bold truncate">{m.name}</div>
                <div className="text-gray-500 text-[10px] font-mono mt-0.5">
                  {m.department} · {m.section}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Problem Statement - assigned */}
      {ps && (
        <div className="p-5 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-3">
          <div className="text-[10px] text-blue-400 font-bold font-mono">ASSIGNED PROBLEM STATEMENT</div>
          <div className="text-base font-bold text-white font-sans">{ps.title}</div>
          {ps.documentUrl && (
            <a
              href={ps.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-colors mt-2 shadow-lg"
            >
              📄 VIEW DOCUMENT
            </a>
          )}
        </div>
      )}

      {/* Dice Roll Game - only for team lead when PS not assigned */}
      {!ps && isLead && psSelectionVisible && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/60 to-gray-900 border border-blue-500/30 text-center space-y-5">
          <div className="text-xs text-blue-400 font-bold font-mono tracking-widest">
            🎲 PROBLEM STATEMENT SELECTION
          </div>
          <p className="text-sm text-gray-400 font-sans">
            As the team lead, roll the dice to receive your problem statement. <strong className="text-red-400">No re-rolls allowed!</strong>
          </p>

          {/* Dice Display */}
          <div className="flex justify-center py-4">
            <div
              className={`w-28 h-28 rounded-2xl border-2 flex items-center justify-center text-5xl font-black font-mono transition-all duration-300 ${
                diceAnimating
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400 animate-bounce shadow-[0_0_30px_rgba(59,130,246,0.3)]'
                  : diceNumber
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : 'border-gray-700 bg-gray-900 text-gray-600'
              }`}
            >
              {diceNumber || '?'}
            </div>
          </div>

          {!rolledPS && (
            <button
              onClick={handleRollDice}
              disabled={rolling}
              className={`px-8 py-3 rounded-xl font-bold text-sm font-sans transition-all w-full sm:w-auto ${
                rolling
                  ? 'bg-blue-500/30 text-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
              }`}
            >
              {rolling ? '🎲 ROLLING...' : '🎲 ROLL THE DICE'}
            </button>
          )}

          {rolledPS && (
            <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-left mt-4">
              <div className="text-[10px] text-emerald-400 font-bold font-mono">🎉 YOU GOT</div>
              <div className="text-sm font-bold text-white font-sans">{rolledPS.title}</div>
              {rolledPS.documentUrl && (
                <a
                  href={rolledPS.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-sans transition-colors mt-2 shadow-lg"
                >
                  📄 VIEW DOCUMENT
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Waiting for PS selection */}
      {!ps && isLead && !psSelectionVisible && (
        <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 text-center text-sm text-gray-500 font-sans">
          🔒 Problem statement selection is not yet open. The admin will enable it soon.
        </div>
      )}

      {!ps && !isLead && (
        <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 text-center text-sm text-gray-500 font-sans">
          ⏳ Your team lead will select the problem statement.
        </div>
      )}
    </div>
  );
}

function ExamPortalCard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/portal/exam/status')
      .then(res => res.json())
      .then(d => { if (d.success) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!data?.examActive) return null;

  const attempt = data.attempt;

  return (
    <div className="p-6 rounded-2xl bg-cyan-950/10 backdrop-blur-md border border-cyan-500/40 space-y-4 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-sans text-cyan-400">
            SECURE EXAM PORTAL
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 font-sans">
            The mandatory technical assessment is now active.
          </p>
        </div>
      </div>
      
      {!attempt || attempt.status === 'not_started' ? (
        <div className="pt-2">
          <p className="text-sm text-gray-300 font-sans mb-4">
            You have not started your exam yet. Ensure you are in a quiet environment before proceeding.
          </p>
          <Link href="/portal/exam">
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-sans transition-colors w-full sm:w-auto shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
              <span>START SECURE EXAM</span>
            </button>
          </Link>
        </div>
      ) : attempt.status === 'completed' ? (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center">
          <div className="text-emerald-400 font-bold font-sans text-sm">EXAM COMPLETED</div>
          <div className="text-xs text-gray-500 mt-1 font-sans">Your responses have been recorded successfully.</div>
        </div>
      ) : attempt.status === 'terminated' ? (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-center">
          <div className="text-red-400 font-bold font-sans text-sm">EXAM TERMINATED</div>
          <div className="text-xs text-gray-500 mt-1 font-sans">Your exam was blocked due to multiple anti-cheat violations.</div>
        </div>
      ) : (
        <div className="pt-2">
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-center mb-4">
            <div className="text-amber-400 font-bold font-sans text-sm">EXAM IN PROGRESS</div>
            <div className="text-xs text-gray-500 mt-1 font-sans">You left the exam before submitting! Return immediately.</div>
          </div>
          <Link href="/portal/exam">
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold font-sans transition-colors w-full shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
              <span>RESUME EXAM</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
