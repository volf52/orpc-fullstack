import { z } from "zod";
import { oz } from "@orpc/zod";

const BaseUserSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(8),
});

export const UserSchema = oz.openapi(BaseUserSchema.omit({ password: true }), {
	examples: [
		{
			id: "c4489351-5a80-4b6e-9d70-d46c83742bac",
			name: "John Doe",
			email: "john.doe@dev.com",
		},
	],
});

export const NewUserSchema = oz.openapi(BaseUserSchema.omit({ id: true }), {
	examples: [
		{
			name: "John Doe",
			email: "john.doe@dev.com",
			password: "suPerSeCreT@123!",
		},
	],
});

export type User = z.infer<typeof UserSchema>;
export type NewUser = z.infer<typeof NewUserSchema>;
