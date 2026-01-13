import { Result as R, type UnitResult } from '@carbonteq/fp'
import type { GroceryListEntity } from '@domain/grocery-list/grocery-list.entity'
import type { UserEntity } from '@domain/user/user.entity'
import type { InviteEntity } from './invite.entity'

export interface InviteUsageAttempt {
  invite: InviteEntity
  list: GroceryListEntity
  user: UserEntity
}

export class InviteDomainService {
  static validateInviteUsage(
    attempt: InviteUsageAttempt,
  ): UnitResult<string[]> {
    const errors: string[] = []
    const { invite, list, user } = attempt

    if (!invite.isValid()) {
      errors.push('Invite has expired')
    }

    if (!invite.belongsToList(list.id)) {
      errors.push('Invite does not belong to this list')
    }

    if (list.isOwner(user.id)) {
      errors.push('User already owns this list')
    }

    if (errors.length === 0) return R.UNIT_RESULT

    return R.Err(errors)
  }
}
