const { z } = require('zod');

const createPostSchema = z.object({
  title: z.string().min(1, 'Post title is required').trim(),
  content: z.string().min(1, 'Post content cannot be empty').trim(),
  category: z.string().optional().nullable(),
  cityId: z.string().optional().nullable(),
  tripId: z.string().optional().nullable(),
  images: z.array(z.string().url('Invalid image URL')).optional().default([]),
});

const updatePostSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').optional(),
  content: z.string().min(1, 'Content cannot be empty').optional(),
  category: z.string().optional().nullable(),
  cityId: z.string().optional().nullable(),
  tripId: z.string().optional().nullable(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
});

const getPostsQuerySchema = z.object({
  search: z.string().optional().transform((val) => val?.trim()),
  cityId: z.string().optional().transform((val) => val?.trim()),
  region: z.string().optional().transform((val) => val?.trim()),
  category: z.string().optional().transform((val) => val?.trim()),
  hasTripLinked: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => (val !== undefined ? val === 'true' : undefined)),
  groupBy: z
    .enum(['city', 'category', 'none'])
    .optional()
    .default('none'),
  sortBy: z
    .enum(['latest', 'most_liked', 'trending'])
    .optional()
    .default('latest'),
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

const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').trim(),
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema,
  createCommentSchema,
};
