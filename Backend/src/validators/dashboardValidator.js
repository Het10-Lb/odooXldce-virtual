const { z } = require('zod');

const topRegionalQuerySchema = z.object({
  search: z.string().optional().transform((val) => val?.trim()),
  region: z.string().optional().transform((val) => val?.trim()),
  maxCost: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().min(1).max(5).optional()),
  sortBy: z
    .enum(['popularity_desc', 'cost_asc', 'cost_desc', 'name_asc'])
    .optional()
    .default('popularity_desc'),
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => Math.max(1, parseInt(val, 10) || 1)),
  limit: z
    .string()
    .optional()
    .default('5')
    .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 5))),
});

const myTripsQuerySchema = z.object({
  search: z.string().optional().transform((val) => val?.trim()),
  status: z
    .enum(['ONGOING', 'UPCOMING', 'COMPLETED', 'ALL'])
    .optional()
    .default('ALL'),
  groupBy: z
    .enum(['status', 'year', 'none'])
    .optional()
    .default('none'),
  sortBy: z
    .enum(['startDate_asc', 'startDate_desc', 'budget_desc', 'createdAt_desc'])
    .optional()
    .default('startDate_desc'),
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => Math.max(1, parseInt(val, 10) || 1)),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 10))),
});

module.exports = {
  topRegionalQuerySchema,
  myTripsQuerySchema,
};
