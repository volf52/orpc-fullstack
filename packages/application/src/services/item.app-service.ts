import type { ApplicationService } from "../types/common.types"

export class ItemAppService implements ApplicationService {
  readonly serviceName = "ItemAppService"

  // Simple application service that provides basic operations
  // Actual business logic will be implemented in workflows
}
