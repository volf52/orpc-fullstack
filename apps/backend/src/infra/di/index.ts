import { GroceryListWorkflows } from "@application/workflows"
import { container } from "tsyringe"
import { registerRepositories } from "../db/repos/di"

const services = [] as const
const workflows = [GroceryListWorkflows] as const

export const wireDi = async () => {
  registerRepositories()

  // register application services
  for (const service of services) {
    container.registerSingleton(service, service)
  }

  for (const workflow of workflows) {
    container.registerSingleton(workflow, workflow)
  }
}
