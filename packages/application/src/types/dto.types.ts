import { z } from "zod"

// Application DTOs using Zod schemas
export const CreateGroceryListDtoSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  ownerId: z.string().uuid(),
})

export const UpdateGroceryListDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
})

export const GroceryListQueryDtoSchema = z.object({
  userId: z.string().uuid(),
  includeCompleted: z.boolean().default(true),
  includeArchived: z.boolean().default(false),
})

export const CreateItemDtoSchema = z.object({
  listId: z.string().uuid(),
  name: z.string().min(1).max(100),
  quantity: z.number().min(1).default(1),
  createdBy: z.string().uuid(),
})

export const UpdateItemDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  quantity: z.number().min(1).optional(),
})

export const BulkItemOperationDtoSchema = z.object({
  itemIds: z.array(z.string().uuid()).min(1),
  operation: z.enum(["mark-complete", "mark-pending", "delete"]),
  userId: z.string().uuid(),
})

export const CreateUserDtoSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  image: z.string().url().optional(),
})

export const UpdateUserDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  image: z.string().url().optional(),
})

export const CreateInviteDtoSchema = z.object({
  groceryListId: z.string().uuid(),
  email: z.string().email(),
  invitedById: z.string().uuid(),
  role: z.enum(["viewer", "editor", "admin"]).default("editor"),
})

export const AcceptInviteDtoSchema = z.object({
  token: z.string(),
  userId: z.string().uuid(),
})

// Infer types from schemas
export type CreateGroceryListDto = z.infer<typeof CreateGroceryListDtoSchema>
export type UpdateGroceryListDto = z.infer<typeof UpdateGroceryListDtoSchema>
export type GroceryListQueryDto = z.infer<typeof GroceryListQueryDtoSchema>

export type CreateItemDto = z.infer<typeof CreateItemDtoSchema>
export type UpdateItemDto = z.infer<typeof UpdateItemDtoSchema>
export type BulkItemOperationDto = z.infer<typeof BulkItemOperationDtoSchema>

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>

export type CreateInviteDto = z.infer<typeof CreateInviteDtoSchema>
export type AcceptInviteDto = z.infer<typeof AcceptInviteDtoSchema>
