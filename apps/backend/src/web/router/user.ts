import { authenticated } from "../utils/orpc"

const base = authenticated.user

export const whoamiHandler = base.whoami.handler(async ({ context }) => {
  return context.auth.user
})

export default base.router({
  whoami: whoamiHandler,
})
