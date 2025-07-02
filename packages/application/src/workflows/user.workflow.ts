import type { UserRepository } from "@repo/domain"
import { ApplicationResult } from "../types/common.types"
import type { CreateUserDto, UpdateUserDto } from "../types/dto.types"

export interface UserDto {
  id: string
  name: string
  email: string
  image?: string
}

export class UserWorkflow {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(
    _request: CreateUserDto,
  ): Promise<ApplicationResult<UserDto>> {
    // Implementation will be added later
    return ApplicationResult.Err(new Error("Not implemented yet"))
  }

  async updateUser(
    _request: UpdateUserDto,
  ): Promise<ApplicationResult<UserDto>> {
    // Implementation will be added later
    return ApplicationResult.Err(new Error("Not implemented yet"))
  }

  async getUserById(_userId: string): Promise<ApplicationResult<UserDto>> {
    // Implementation will be added later
    return ApplicationResult.Err(new Error("Not implemented yet"))
  }

  async deleteUser(_userId: string): Promise<ApplicationResult<void>> {
    // Implementation will be added later
    return ApplicationResult.Err(new Error("Not implemented yet"))
  }
}
