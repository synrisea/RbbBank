import { z } from 'zod';

export const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.email('Invalid email address'),
    password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
    phone: z
    .string()
    .regex(/^\+?[0-9]+$/, 'Phone number must contain only digits and can start with +'),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;