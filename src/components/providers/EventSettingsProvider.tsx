'use client';

import React, { createContext, useContext } from 'react';

export interface EventSettingsContextData {
  eventName: string;
  tagline: string;
  dates: string;
  venue: string;
  contactPhone: string;
  contactEmail: string;
  whatsappGroupLink?: string | null;
  whatsappGroupQrUrl?: string | null;
  countdownTarget?: string | null;
}

const defaultSettings: EventSettingsContextData = {
  eventName: 'NEXUS Tech Summit',
  tagline: 'Innovate. Connect. Build.',
  dates: 'August 29 – 30, 2026',
  venue: 'Main nexus Range Auditorium & SOC Lab 4',
  contactPhone: '+91 98765 43210',
  contactEmail: 'soc-support@nextgensoc.io',
};

const EventSettingsContext = createContext<EventSettingsContextData>(defaultSettings);

export function useEventSettings() {
  return useContext(EventSettingsContext);
}

export function EventSettingsProvider({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: Partial<EventSettingsContextData>;
}) {
  const mergedSettings = { ...defaultSettings, ...settings };

  return (
    <EventSettingsContext.Provider value={mergedSettings}>
      {children}
    </EventSettingsContext.Provider>
  );
}
