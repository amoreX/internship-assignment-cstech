import { z } from 'zod';

// Common schemas
const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .max(50, 'Password cannot exceed 50 characters');

const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(100, 'Email cannot exceed 100 characters');

const phoneSchema = z
  .string()
  .regex(
    /^\+[1-9]\d{1,14}$/,
    'Phone number must be in international format (e.g., +1234567890)'
  );

// Login
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type Login = z.infer<typeof loginSchema>;

// Agents
export const insertAgentSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters'),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export type InsertAgent = z.infer<typeof insertAgentSchema>;

export const updateAgentSchema = insertAgentSchema.partial();

export type UpdateAgent = z.infer<typeof updateAgentSchema>;

// Distribution
export const distributionSchema = z.object({
  agentId: z.string(),
  amount: z.number().min(0, 'Amount must be greater than or equal to 0'),
  date: z.string().datetime(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export type Distribution = z.infer<typeof distributionSchema>;