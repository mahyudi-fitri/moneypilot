import { z } from 'zod';

const optionalDate = z
  .string()
  .datetime({ offset: true })
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a YYYY-MM-DD date'))
  .optional();

export const transactionQuerySchema = z.object({
  accountId: z.string().optional(),
  type: z.enum(['all', 'CREDIT', 'DEBIT']).optional(),
  startDate: optionalDate,
  endDate: optionalDate,
  search: z.string().optional(),
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
