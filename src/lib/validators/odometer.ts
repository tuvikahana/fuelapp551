import { z } from 'zod';

export const odometerInputSchema = z.object({
  confirmedValue: z.number().positive('יש להזין מספר ק״מ תקין'),
  inputMethod: z.enum(['scan', 'manual']),
  ocrValue: z.number().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

export type OdometerInput = z.infer<typeof odometerInputSchema>;
