import { z } from "zod";

export const signInSchema = z.object({
    email: z
    .email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
})

export type SignInSchemaType = z.infer<typeof signInSchema>;
