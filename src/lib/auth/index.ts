


import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema.js';
import { betterAuthOptions } from './options.js';
import type { Env } from './env.types.js';

export const createAuth = (env: Env) => {
    const pool = new Pool({
        connectionString: env.POSTGRE_DB_URL,
    });

    const db = drizzle(pool);

    return betterAuth({
        ...betterAuthOptions(env),

        database: drizzleAdapter(db, {
            provider: 'pg',
            schema,
        }),

        baseURL: env.BETTER_AUTH_URL,
        secret: env.BETTER_AUTH_SECRET,
    });
};
