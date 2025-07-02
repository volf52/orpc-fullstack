import type { GroceryListEntity, ItemEntity, UserEntity } from "@repo/domain"

/**
 * Maps domain entities to DTOs for API responses
 */
export const domainMapper = {
  groceryListToDto: (list: GroceryListEntity, owner: UserEntity) => ({
    id: list.id,
    name: list.name,
    description: list.description,
    ownerId: list.ownerId,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
    owner: {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      image: owner.image,
    },
  }),

  itemToDto: (item: ItemEntity) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    status: item.status,
    isPending: item.isPending(),
    isBought: item.isBought(),
    listId: item.listId,
    createdBy: item.createdBy,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }),

  userToDto: (user: UserEntity) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }),

  itemsToDisplayDto: (items: ItemEntity[]) =>
    items.map((item) => domainMapper.itemToDto(item)),

  groceryListWithStatsToDto: (
    list: GroceryListEntity,
    owner: UserEntity,
    items: ItemEntity[],
    stats: {
      totalItems: number
      pendingItems: number
      completedItems: number
      completionPercentage: number
    },
  ) => ({
    ...domainMapper.groceryListToDto(list, owner),
    items: domainMapper.itemsToDisplayDto(items),
    stats,
  }),
}

/**
 * Helper functions for common mapping operations
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
