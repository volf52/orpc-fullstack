import type { ApplicationService } from "../types/common.types"

export class UserAppService implements ApplicationService {
  readonly serviceName = "UserAppService"

  // Simple application service that provides basic operations
  // Actual business logic will be implemented in workflows
}
