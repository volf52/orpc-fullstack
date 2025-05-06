import { signin, signup, whoami } from "./auth"

export const CONTRACT = {
  public: {
    auth: { signin, signup },
  },
  authenticated: {
    auth: { whoami },
  },
}
