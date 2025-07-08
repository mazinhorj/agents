import { z } from 'zod';

export const envSchema = z.object({
    PORT: z.coerce.number().min(1024).max(65535).default(3333),
    DATABASE_URL: z.string().url().startsWith('postgres://'),
});

export type EnvSchema = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);