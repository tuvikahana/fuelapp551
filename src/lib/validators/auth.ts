import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'שם משתmש נדרש'),
  password: z.string().min(1, 'סיסמה נדרשת'),
});

export type LoginInput = z.infer<typeof loginSchema>;
