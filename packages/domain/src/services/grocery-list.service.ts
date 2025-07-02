import type { GroceryListEntity } from "../entities/grocery-list.entity"
import type { ItemEntity } from "../entities/item.entity"
import type { UserEntity, UserType } from "../entities/user.entity"

export interface GroceryListStats {
  totalItems: number
  pendingItems: number
  completedItems: number
  completionPercentage: number
}

export interface GroceryListWithItemsAndOwner {
  list: GroceryListEntity
  owner: UserEntity
  items: ItemEntity[]
  stats: GroceryListStats
}

export class GroceryListService {
  calculateDetailedStats(items: ItemEntity[]): GroceryListStats {
    const totalItems = items.length
    const pendingItems = items.filter((item) => item.isPending()).length
    const completedItems = items.filter((item) => item.isBought()).length

    const completionPercentage =
      totalItems > 0 ? (completedItems / totalItems) * 100 : 0

    return {
      totalItems,
      pendingItems,
      completedItems,
      completionPercentage: Math.round(completionPercentage * 100) / 100,
    }
  }

  aggregateListView(
    list: GroceryListEntity,
    owner: UserEntity,
    items: ItemEntity[],
  ): GroceryListWithItemsAndOwner {
    const stats = this.calculateDetailedStats(items)

    return {
      list,
      owner,
      items,
      stats,
    }
  }

  calculateCompletionStatus(
    items: ItemEntity[],
  ):
    | "empty"
    | "just-started"
    | "in-progress"
    | "nearly-complete"
    | "completed" {
    if (items.length === 0) {
      return "empty"
    }

    const completedItems = items.filter((item) => item.isBought()).length
    const completionRatio = completedItems / items.length

    if (completionRatio === 0) {
      return "just-started"
    } else if (completionRatio === 1) {
      return "completed"
    } else if (completionRatio >= 0.8) {
      return "nearly-complete"
    } else {
      return "in-progress"
    }
  }

  organizeItemsForDisplay(items: ItemEntity[]): {
    pending: ItemEntity[]
    completed: ItemEntity[]
    recent: ItemEntity[]
  } {
    const pending = items
      .filter((item) => item.isPending())
      .sort((a, b) => a.name.localeCompare(b.name))

    const completed = items
      .filter((item) => item.isBought())
      .sort((a, b) => a.name.localeCompare(b.name))

    // For recent, we'll sort by creation order (newest first)
    const recent = items
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 5)

    return {
      pending,
      completed,
      recent,
    }
  }

  validateBulkItemOperation(
    items: ItemEntity[],
    operation: "mark-complete" | "mark-pending" | "delete",
    userId: UserType["id"],
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check if all items can be modified by the user
    const unauthorizedItems = items.filter(
      (item) => !item.canBeDeletedBy(userId),
    )
    if (unauthorizedItems.length > 0) {
      errors.push(
        `Cannot ${operation} ${unauthorizedItems.length} items: insufficient permissions`,
      )
    }

    // Check operation-specific rules
    if (operation === "mark-complete") {
      const alreadyCompleted = items.filter((item) => item.isBought())
      if (alreadyCompleted.length === items.length) {
        errors.push("All items are already completed")
      }
    } else if (operation === "mark-pending") {
      const alreadyPending = items.filter((item) => item.isPending())
      if (alreadyPending.length === items.length) {
        errors.push("All items are already pending")
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}
