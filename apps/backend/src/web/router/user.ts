import { authenticated } from "../utils/orpc"

const base = authenticated.user

export const whoamiHandler = base.whoami.handler(async ({ context }) => {
  // TODO: Better error handling, maybe a unified interceptor?
  return context.user.serialize().unwrap()
})

export default base.router({
  whoami: whoamiHandler,
})
