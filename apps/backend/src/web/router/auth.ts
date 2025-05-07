import { authenticated, pub } from "../utils/orpc"
import { container } from "tsyringe"
import { AuthService } from "@/application/services/auth.service"

const authServ = container.resolve(AuthService)

export const signupHandler = pub.auth.signup.handler(
  async ({ input, errors }) => {
    const registeredUser = await authServ.register(input)
    if (registeredUser === null) {
      throw errors.AlreadyExists()
    }

    return registeredUser
  },
)

export const signinHandler = pub.auth.signin.handler(
  async ({ input, errors }) => {
    const user = await authServ.fetchUserByEmail(input.email)
    if (!user) {
      throw errors.INVALID_CREDENTIALS()
    }

    const passwordMatches = await authServ.checkPassword(user, input.password)
    if (!passwordMatches) {
      throw errors.INVALID_CREDENTIALS()
    }

    const token = authServ.encodeToken(user)

    const { password, ...userWithoutPassword } = user

    return { token, user: userWithoutPassword }
  },
)

export const whoamiHandler = authenticated.auth.whoami.handler(
  async ({ context }) => {
    return context.user
  },
)
