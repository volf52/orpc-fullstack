import { whoamiHandler } from "./auth"
import { authenticated } from "../utils/orpc"

export const router = {
  // public: pub.router({
  //   auth: { signin: signinHandler, signup: signupHandler },
  // }),
  authenticated: authenticated.router({
    auth: { whoami: whoamiHandler },
  }),
}
