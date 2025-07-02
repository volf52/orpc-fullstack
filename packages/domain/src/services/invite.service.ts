import { Result as R, type UnitResult } from "@carbonteq/fp"
import type { GroceryListEntity } from "../entities/grocery-list.entity"
import type { InviteEntity } from "../entities/invite.entity"
import type { UserEntity } from "../entities/user.entity"

export interface InviteUsageAttempt {
  invite: InviteEntity
  list: GroceryListEntity
  user: UserEntity
}

export const InviteDomainService = {
  validateInviteUsage: (attempt: InviteUsageAttempt): UnitResult<string[]> => {
    const errors: string[] = []
    const { invite, list, user } = attempt

    if (!invite.isValid()) {
      errors.push("Invite has expired")
    }

    if (!invite.belongsToList(list.id)) {
      errors.push("Invite does not belong to this list")
    }

    if (list.isOwner(user.id)) {
      errors.push("User already owns this list")
    }

    if (errors.length === 0) return R.UNIT_RESULT

    return R.Err(errors)
  },
} as const
