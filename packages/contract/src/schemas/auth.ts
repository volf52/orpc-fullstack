import { z } from "zod";

export const CredentialsSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const TokenSchema = z.object({ token: z.string() });
