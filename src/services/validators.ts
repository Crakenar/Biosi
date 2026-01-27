import { z } from 'zod';
import { APP_CONFIG } from '../constants/config';

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(APP_CONFIG.VALIDATION.MIN_NAME_LENGTH, 'Name must be at least 2 characters')
    .max(APP_CONFIG.VALIDATION.MAX_NAME_LENGTH, 'Name must be at most 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  age: z
    .number()
    .min(APP_CONFIG.VALIDATION.MIN_AGE, 'Age must be at least 16')
    .max(APP_CONFIG.VALIDATION.MAX_AGE, 'Age must be at most 100'),
  wage: z.object({
    amount: z.number().min(APP_CONFIG.VALIDATION.MIN_WAGE, 'Wage must be positive'),
    period: z.enum(['hourly', 'monthly', 'yearly']),
  }),
  currency: z.string().length(3, 'Currency code must be 3 characters'),
});

export const transactionSchema = z.object({
  itemPrice: z.number().positive('Price must be positive'),
  type: z.enum(['purchased', 'saved']),
  note: z.string().optional(),
});

export const priceInputSchema = z.object({
  price: z.number().positive('Price must be positive'),
});
