import NextWaveNavbar from '@/components/landing/NexusNavbar';
import HeroSection from '@/components/landing/HeroSection';
import { db } from '@/db';
import { eventSettings } from '@/db/schema';
import { EventSettingsProvider } from '@/components/providers/EventSettingsProvider';
import LiveRegistrationTracker from '@/components/landing/LiveSlotTracker';
import EventQuickInfo from '@/components/landing/EventOverviewSection';
import EventSpecsSection from '@/components/landing/EventSpecsSection';
import CreditRegistrationSection from '@/components/landing/CreditRegistrationSection';
import AboutSection from '@/components/landing/WhatYouLearnSection';
import HighlightsSection from '@/components/landing/HighlightsSection';
import TimelineSection from '@/components/landing/SchedulePreview';
import EligibilitySection from '@/components/landing/CreditTypeSection';
import RegistrationCountdown from '@/components/landing/RegistrationCountdown';
import FinalCta from '@/components/landing/RegistrationCtaSection';
import ImportantInfoSection from '@/components/landing/ImportantInfoSection';
import FaqSection from '@/components/landing/FaqSection';
import CoordinatorsSection from '@/components/landing/CoordinatorsSection';
import Footer from '@/components/landing/Footer';
import PreloaderWrapper from '@/components/animations/PreloaderWrapper';
import CodeRevealWrapper from '@/components/animations/CodeRevealWrapper';
import NextWaveBackground from '@/components/animations/NextWaveBackground';

export default async function LandingPage() {
  const settings = (await db.select().from(eventSettings).limit(1))[0];

  return (
    <main className="relative min-h-screen text-cyber-text overflow-x-hidden selection:bg-red-500 selection:text-black">
      <EventSettingsProvider settings={settings || {}}>
        <PreloaderWrapper>
          <div className="relative z-10 flex flex-col min-h-screen">
          <NextWaveNavbar />
          <HeroSection />
          <LiveRegistrationTracker />
          <CodeRevealWrapper duration={0.6}>
            <EventQuickInfo />
          </CodeRevealWrapper>
          <CodeRevealWrapper duration={0.6}>
            <EventSpecsSection />
          </CodeRevealWrapper>
          <CodeRevealWrapper duration={0.6}>
            <CreditRegistrationSection />
          </CodeRevealWrapper>
          <CodeRevealWrapper duration={0.6}>
            <AboutSection />
          </CodeRevealWrapper>
          <CodeRevealWrapper duration={0.6}>
            <HighlightsSection />
          </CodeRevealWrapper>
          <CodeRevealWrapper duration={0.6}>
            <TimelineSection />
          </CodeRevealWrapper>
          <EligibilitySection />
          <RegistrationCountdown />
          <FinalCta />
          <ImportantInfoSection />
          <FaqSection />
          <CoordinatorsSection />
          <Footer />
        </div>
      </PreloaderWrapper>
      </EventSettingsProvider>
    </main>
  );
}
