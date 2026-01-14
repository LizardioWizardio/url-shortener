// apps/web/lib/schemas.ts

import { z } from 'zod';

export const createUrlSchema = z.object({
  originalUrl: z.url('Введи валидный URL'),
  customCode: z
    .string()
    .min(4, 'Минимум 4 символа')
    .max(20, 'Максимум 20 символов')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Только латиница, цифры, _ и -')
    .optional()
    .or(z.literal('')),
  title: z.string().max(255).optional(),
  expiresAt: z.iso.datetime().optional(),
  maxClicks: z.number().int().positive().optional(),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;