import type { UserEntity } from "@repo/domain"

/**
 * Helper functions for common operations
 */
export const mappers = {
  /**
   * Creates a paginated response structure
   */
  createPaginatedResponse: <T>(
    items: T[],
    totalCount: number,
    page: number,
    limit: number,
  ) => ({
    items,
    totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    hasNext: page * limit < totalCount,
    hasPrevious: page > 1,
  }),

  /**
   * Filters sensitive data from user objects
   */
  sanitizeUser: (user: UserEntity) => ({
    id: user.id,
    name: user.name,
    image: user.image,
  }),
}
