import { AppError, ApplicationResult } from "../types/common.types"

// Simple interfaces for the workflow - should be imported from domain
interface ItemRepository {
  findById(id: string): Promise<unknown>
  save(item: unknown): Promise<void>
}

interface GroceryListRepository {
  findById(id: string): Promise<unknown>
  save(list: unknown): Promise<void>
}

interface GroceryItemDomainService {
  addItemToList(list: unknown, itemId: string, quantity: number): unknown
  removeItemFromList(list: unknown, itemId: string): unknown
}

// Simple DTOs - should be imported from proper DTOs
interface AddItemToListDto {
  groceryListId: string
  itemId: string
  quantity: number
}

interface UpdateItemDto {
  quantity?: number
  isPurchased?: boolean
}

export class ItemWorkflow {
  constructor(
    private itemRepository: ItemRepository,
    private groceryListRepository: GroceryListRepository,
    private groceryItemDomainService: GroceryItemDomainService,
  ) {}

  async addItemToList(
    userId: string,
    dto: AddItemToListDto,
  ): Promise<ApplicationResult<void>> {
    try {
      // Check if grocery list exists and user has access
      const groceryList = await this.groceryListRepository.findById(
        dto.groceryListId,
      )
      if (!groceryList) {
        return ApplicationResult.Err(
          AppError.NotFound("Grocery list not found"),
        )
      }

      // Check if user owns the grocery list or is a collaborator
      const list = groceryList as any
      if (
        list.ownerId !== userId &&
        !list.collaborators.some((c: any) => c.userId === userId)
      ) {
        return ApplicationResult.Err(
          AppError.Unauthorized(
            "User does not have access to this grocery list",
          ),
        )
      }

      // Use domain service to add item to the list
      const result = this.groceryItemDomainService.addItemToList(
        groceryList,
        dto.itemId,
        dto.quantity,
      )

      const domainResult = result as any
      if (domainResult.isErr?.()) {
        return ApplicationResult.Err(
          AppError.InvalidOperation(domainResult.error.message),
        )
      }

      await this.groceryListRepository.save(domainResult.value || result)
      return ApplicationResult.Ok(undefined)
    } catch {
      return ApplicationResult.Err(
        AppError.Generic("Failed to add item to list"),
      )
    }
  }

  async updateItem(
    userId: string,
    itemId: string,
    dto: UpdateItemDto,
  ): Promise<ApplicationResult<void>> {
    try {
      const item = await this.itemRepository.findById(itemId)
      if (!item) {
        return ApplicationResult.Err(AppError.NotFound("Item not found"))
      }

      // Get the grocery list to check permissions
      const itemObj = item as any
      const groceryList = await this.groceryListRepository.findById(
        itemObj.groceryListId,
      )
      if (!groceryList) {
        return ApplicationResult.Err(
          AppError.NotFound("Grocery list not found"),
        )
      }

      // Check if user owns the grocery list or is a collaborator
      const list = groceryList as any
      if (
        list.ownerId !== userId &&
        !list.collaborators.some((c: any) => c.userId === userId)
      ) {
        return ApplicationResult.Err(
          AppError.Unauthorized("User does not have access to this item"),
        )
      }

      // Update item properties
      if (dto.quantity !== undefined) {
        itemObj.updateQuantity(dto.quantity)
      }

      if (dto.isPurchased !== undefined) {
        if (dto.isPurchased) {
          itemObj.markAsPurchased()
        } else {
          itemObj.markAsNotPurchased()
        }
      }

      await this.itemRepository.save(item)
      return ApplicationResult.Ok(undefined)
    } catch {
      return ApplicationResult.Err(AppError.Generic("Failed to update item"))
    }
  }

  async removeItemFromList(
    userId: string,
    groceryListId: string,
    itemId: string,
  ): Promise<ApplicationResult<void>> {
    try {
      // Check if grocery list exists and user has access
      const groceryList =
        await this.groceryListRepository.findById(groceryListId)
      if (!groceryList) {
        return ApplicationResult.Err(
          AppError.NotFound("Grocery list not found"),
        )
      }

      // Check if user owns the grocery list or is a collaborator
      const list = groceryList as any
      if (
        list.ownerId !== userId &&
        !list.collaborators.some((c: any) => c.userId === userId)
      ) {
        return ApplicationResult.Err(
          AppError.Unauthorized(
            "User does not have access to this grocery list",
          ),
        )
      }

      // Use domain service to remove item from the list
      const result = this.groceryItemDomainService.removeItemFromList(
        groceryList,
        itemId,
      )

      const domainResult = result as any
      if (domainResult.isErr?.()) {
        return ApplicationResult.Err(
          AppError.InvalidOperation(domainResult.error.message),
        )
      }

      await this.groceryListRepository.save(domainResult.value || result)
      return ApplicationResult.Ok(undefined)
    } catch {
      return ApplicationResult.Err(
        AppError.Generic("Failed to remove item from list"),
      )
    }
  }
}
