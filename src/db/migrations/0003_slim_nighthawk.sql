ALTER TABLE "event_settings" ALTER COLUMN "event_name" SET DEFAULT 'NEXUS Tech Summit';--> statement-breakpoint
ALTER TABLE "event_settings" ALTER COLUMN "tagline" SET DEFAULT 'Innovate. Connect. Build.';--> statement-breakpoint
ALTER TABLE "event_settings" ALTER COLUMN "venue" SET DEFAULT 'Main nexus Range Auditorium & SOC Lab 4';--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD COLUMN "round2_score" integer;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD COLUMN "round3_score" integer;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "residence_type" text DEFAULT 'DAY_SCHOLAR' NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "hostel_name" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "room_number" text;