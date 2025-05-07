import { z } from "zod"
import { UserSchema } from "./user"

export const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const TokenWithUserSchema = z.object({
  token: z.string(),
  user: UserSchema,
})
