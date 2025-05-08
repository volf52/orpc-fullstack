import { whoami } from "./user"

export const CONTRACT = {
  // public: {
  //   auth: { signin, signup },
  // },
  authenticated: {
    auth: { whoami },
  },
}
