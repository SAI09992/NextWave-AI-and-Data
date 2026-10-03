-- Add round/day support to exam system
-- These columns use defaults to be backward-compatible with existing data (Round 1 Day 1 is current live exam)

ALTER TABLE exam_settings ADD COLUMN IF NOT EXISTS active_test_round TEXT NOT NULL DEFAULT 'round1_day1';

ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS round TEXT NOT NULL DEFAULT 'round1_day1';
CREATE INDEX IF NOT EXISTS exam_questions_round_idx ON exam_questions (round);

ALTER TABLE exam_attempts ADD COLUMN IF NOT EXISTS round1_score INTEGER;
ALTER TABLE exam_attempts ADD COLUMN IF NOT EXISTS round TEXT NOT NULL DEFAULT 'round1_day1';
