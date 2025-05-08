import { z } from "zod"
import { oz } from "@orpc/zod"

// User type in better-auth
export type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  image?: string | null
}

const BaseUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  image: z.string().optional().nullable(),
})

export const UserSchema = oz.openapi(BaseUserSchema, {
  examples: [
    {
      id: "c4489351-5a80-4b6e-9d70-d46c83742bac",
      name: "John Doe",
      email: "john.doe@dev.com",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
})

// export const NewUserSchema = oz.openapi(BaseUserSchema.omit({ id: true }), {
//   examples: [
//     {
//       name: "John Doe",
//       email: "john.doe@dev.com",
//       password: "suPerSeCreT@123!",
//     },
//   ],
// })

// export type NewUser = z.infer<typeof NewUserSchema>
