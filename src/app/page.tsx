import NextWaveNavbar from '@/components/landing/NexusNavbar';
import HeroSection from '@/components/landing/HeroSection';
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
import AlumniClubCardSection from '@/components/landing/AlumniClubCardSection';
import Footer from '@/components/landing/Footer';
import PreloaderWrapper from '@/components/animations/PreloaderWrapper';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen text-cyber-text overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      <PreloaderWrapper>
        <div className="relative z-10 flex flex-col min-h-screen">
          <NextWaveNavbar />
          <HeroSection />
          <LiveRegistrationTracker />
          <EventQuickInfo />
          <EventSpecsSection />
          <CreditRegistrationSection />
          <AboutSection />
          <HighlightsSection />
          <TimelineSection />
          <EligibilitySection />
          <RegistrationCountdown />
          <FinalCta />
          <ImportantInfoSection />
          <FaqSection />
          <CoordinatorsSection />
          <AlumniClubCardSection />
          <Footer />
        </div>
      </PreloaderWrapper>
    </main>
  );
}
