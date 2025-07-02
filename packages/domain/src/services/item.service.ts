import { DateTime as DT } from "effect"
import type { ItemEntity } from "../entities/item.entity"

function sortItemsForDisplay(items: ItemEntity[]): ItemEntity[] {
  return items.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "pending" ? -1 : 1
    }

    return DT.distance(b.createdAt, a.createdAt)
  })
}

// Like a class with static only methods
export const ItemsDomainService = {
  sortItemsForDisplay,
} as const
