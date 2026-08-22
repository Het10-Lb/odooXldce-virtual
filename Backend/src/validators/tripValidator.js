const { z } = require('zod');

const createTripSchema = z.object({
  name: z.string().min(1, 'Trip name is required').trim(),
  startDate: z.string().datetime({ message: 'Invalid ISO date string for startDate' }).or(z.string().min(1)),
  endDate: z.string().datetime({ message: 'Invalid ISO date string for endDate' }).or(z.string().min(1)),
  description: z.string().optional().nullable(),
  coverPhotoUrl: z.string().url('Invalid URL for cover photo').optional().nullable().or(z.literal('')),
  initialCityId: z.string().optional().nullable(),
  initialBudget: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => (val !== undefined && val !== null ? parseFloat(val) : 0)),
  isPublic: z.boolean().optional().default(false),
});

const getSuggestionsQuerySchema = z.object({
  cityId: z.string().optional().transform((val) => val?.trim()),
  type: z
    .enum(['TRANSPORT', 'STAY', 'ACTIVITY', 'MEAL', 'OTHER'])
    .optional(),
  maxCost: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseFloat(val) : undefined)),
  search: z.string().optional().transform((val) => val?.trim()),
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

const getTemplatesQuerySchema = z.object({
  cityId: z.string().optional().transform((val) => val?.trim()),
  region: z.string().optional().transform((val) => val?.trim()),
  maxDays: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseInt(val, 10) : undefined)),
  maxBudget: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseFloat(val) : undefined)),
  search: z.string().optional().transform((val) => val?.trim()),
  sortBy: z
    .enum(['popularity_desc', 'duration_asc', 'budget_asc'])
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
    .default('10')
    .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 10))),
});

const createSectionSchema = z.object({
  sectionTitle: z.string().min(1, 'Section title is required').trim(),
  cityId: z.string().optional().nullable(),
  startDate: z.string().datetime({ message: 'Invalid ISO date string for startDate' }).or(z.string().min(1)),
  endDate: z.string().datetime({ message: 'Invalid ISO date string for endDate' }).or(z.string().min(1)),
  budgetAllocated: z
    .union([z.number(), z.string()])
    .optional()
    .default(0)
    .transform((val) => (val !== undefined && val !== null ? parseFloat(val) : 0)),
  description: z.string().optional().nullable(),
});

const attachTemplateSchema = z.object({
  templateSectionId: z.string().min(1, 'Template section ID is required').trim(),
  startDate: z.string().optional(),
  customTitle: z.string().optional(),
});

const updateSectionSchema = z.object({
  sectionTitle: z.string().min(1, 'Section title cannot be empty').optional(),
  cityId: z.string().optional().nullable(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budgetAllocated: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => (val !== undefined && val !== null ? parseFloat(val) : undefined)),
  description: z.string().optional().nullable(),
});

const createItineraryItemSchema = z.object({
  title: z.string().min(1, 'Item title is required').trim(),
  type: z
    .enum(['TRANSPORT', 'STAY', 'ACTIVITY', 'MEAL', 'OTHER'])
    .optional()
    .default('ACTIVITY'),
  activityId: z.string().optional().nullable(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  cost: z
    .union([z.number(), z.string()])
    .optional()
    .default(0)
    .transform((val) => (val !== undefined && val !== null ? parseFloat(val) : 0)),
  notes: z.string().optional().nullable(),
});

const reorderSchema = z.object({
  sections: z
    .array(
      z.object({
        id: z.string().min(1),
        orderIndex: z.number().int().min(1),
      })
    )
    .optional(),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        orderIndex: z.number().int().min(1),
      })
    )
    .optional(),
});

module.exports = {
  createTripSchema,
  getSuggestionsQuerySchema,
  getTemplatesQuerySchema,
  createSectionSchema,
  attachTemplateSchema,
  updateSectionSchema,
  createItineraryItemSchema,
  reorderSchema,
};
