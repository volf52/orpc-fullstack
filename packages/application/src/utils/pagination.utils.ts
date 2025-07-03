import { z } from "zod"

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResult<T> {
  items: T[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

// Validation schemas for pagination types
export const PaginationParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
})

export type ValidatedPaginationParams = z.infer<typeof PaginationParamsSchema>

// Utility functions for pagination
export const createPaginatedResult = <T>(
  items: T[],
  totalCount: number,
  page: number,
  limit: number,
): PaginatedResult<T> => {
  const totalPages = Math.ceil(totalCount / limit)

  return {
    items,
    totalCount,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  }
}

export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit
}
