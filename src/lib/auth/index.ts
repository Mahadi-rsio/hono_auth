import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema.js';
import { betterAuthOptions } from './options.js';
import { Env } from './env.types.js';



export const createAuth = (env: Env) => {

    const db = drizzle(env.DB)

    return betterAuth({
        ...betterAuthOptions(env),

        database: drizzleAdapter(db, {
            provider: 'sqlite',
            schema,
        }),

        baseURL: env.BETTER_AUTH_URL,
        secret: env.BETTER_AUTH_SECRET,
    });
};
