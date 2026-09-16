import { z } from 'zod';

// Terms & Conditions Schema
export const termsAcceptanceSchema = z.object({
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions to proceed.' }),
  }),
  informationAccurate: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm the information provided is accurate.' }),
  }),
  paymentVerificationUnderstood: z.literal(true, {
    errorMap: () => ({ message: 'You must acknowledge that payment verification is required.' }),
  }),
  antiFraudAgreed: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to anti-fraud and duplicate submission rules.' }),
  }),
  workshopRulesAgreed: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to workshop participation rules.' }),
  }),
});

// Step 1: Personal Details Schema
export const step1PersonalSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number (starts with 6-9)'),
});

// Step 2: Academic Details Schema
export const step2AcademicSchema = z.object({
  registerNumber: z
    .string()
    .min(5, 'Register/Roll number must be at least 5 characters')
    .max(30, 'Register number too long')
    .regex(/^[A-Za-z0-9\-_]+$/, 'Register number must contain only alphanumeric characters, dashes, or underscores'),
  department: z.string().min(2, 'Please select/enter your department'),
  year: z.enum(['2nd Year', '3rd Year', '4th Year'], {
    errorMap: () => ({ message: 'Please select your year of study (2nd, 3rd, or 4th)' }),
  }),
  section: z.string().min(1, 'Section is required (e.g. A, B, C, or N/A)'),
  college: z.string().min(3, 'Please enter your college/institution name'),
  creditType: z.enum(['PE_CSE', 'PE_IT', 'UE'], {
    errorMap: () => ({ message: 'Please select your credit eligibility type' }),
  }),
});

// Step 3: Residence Details Schema
export const step3ResidenceSchema = z.object({
  residenceType: z.enum(['HOSTEL', 'DAY_SCHOLAR'], {
    errorMap: () => ({ message: 'Please select your residence type' }),
  }),
  hostelName: z.string().optional().nullable(),
  roomNumber: z.string().optional().nullable(),
}).refine((data) => {
  if (data.residenceType === 'HOSTEL') {
    return !!data.hostelName && data.hostelName.length > 0 && !!data.roomNumber && data.roomNumber.length > 0;
  }
  return true;
}, {
  message: "Hostel Name and Room Number are required if you are a hosteller",
  path: ["hostelName"],
});

// Full Registration Schema
export const fullRegistrationSchema = step1PersonalSchema
  .merge(step2AcademicSchema)
  .and(step3ResidenceSchema);

export type FullRegistrationInput = z.infer<typeof fullRegistrationSchema>;

// Payment Submission Schema
export const paymentSubmissionSchema = z.object({
  registrationId: z.string().min(5, 'Invalid Registration ID'),
  utr: z
    .string()
    .min(10, 'UTR / Transaction Reference must be at least 10 characters')
    .max(30, 'UTR is too long')
    .regex(/^[A-Za-z0-9]+$/, 'UTR must only contain letters and numbers (no spaces or symbols)'),
  amount: z.number().positive('Payment amount must be greater than 0'),
  screenshotUrl: z
    .string()
    .min(10, 'Screenshot image is required')
    .refine(
      (val) =>
        val.startsWith('http://') ||
        val.startsWith('https://') ||
        val.startsWith('data:image/'),
      { message: 'Screenshot URL must be a valid HTTP/HTTPS URL or Data URI' }
    ),
  ocrUtr: z.string().optional().nullable(),
  ocrAmount: z.number().optional().nullable(),
  ocrDate: z.string().optional().nullable(),
  ocrConfidence: z.number().min(0).max(100).optional().nullable(),
});

export type PaymentSubmissionInput = z.infer<typeof paymentSubmissionSchema>;

// Admin Verification Schema
export const adminPaymentDecisionSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID required'),
  decision: z.enum(['verified', 'rejected', 'requires_attention']),
  rejectionReason: z.string().max(500).optional(),
});

// Attendance Scan Schema
export const attendanceScanSchema = z.object({
  registrationId: z.string().min(5, 'Invalid Registration ID'),
  day: z.number().int().min(1).max(2),
  session: z.string().default('morning'),
  secretToken: z.string().optional(),
});

// Announcement Form Schema
export const announcementFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  priority: z.enum(['normal', 'important', 'critical']),
  audience: z.enum(['all', 'PE_CSE', 'PE_IT', 'UE']),
  published: z.boolean().default(true),
});

// Event Settings Schema
export const eventSettingsSchema = z.object({
  eventName: z.string().min(2),
  tagline: z.string().min(2),
  dates: z.string().min(2),
  venue: z.string().min(2),
  registrationFee: z.number().nonnegative(),
  totalCapacity: z.number().positive(),
  registrationOpen: z.boolean(),
  paymentUpiId: z.string().min(3),
  paymentQrUrl: z.string().optional().nullable(),
  contactPhone: z.string().min(5),
  contactEmail: z.string().email(),
  termsVersion: z.string().min(1),
  countdownTarget: z.string().optional(),
});
