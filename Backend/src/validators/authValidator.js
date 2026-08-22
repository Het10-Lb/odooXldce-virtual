const { z } = require('zod');

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  email: z.string().email('Invalid email address format').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  phoneNumber: z.string().optional().nullable(),
  photoUrl: z.string().url('Invalid URL format for photoUrl').optional().nullable().or(z.literal('')),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  languagePreference: z.string().optional().default('en'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address format').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address format').toLowerCase().trim(),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
};
