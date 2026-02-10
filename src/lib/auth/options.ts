import { BetterAuthOptions } from 'better-auth';
import { bearer, openAPI } from 'better-auth/plugins';
import { jwtPlugin } from './jwt.plugin.js';
import { createRedis } from './redis.js';
import type { Env } from './env.types.js';

export const betterAuthOptions = (env: Env): BetterAuthOptions => {
    const redis = createRedis(env);

    return {
        appName: 'Auth',
        basePath: '/api/auth',

        trustedOrigins: [env.ORIGIN],

        secondaryStorage: {
            get: async (key) => {
                if (key.startsWith('betterauth:jwks')) return null;
                return redis.get(key);
            },
            set: async (key, value, ttl) => {
                if (key.startsWith('betterauth:jwks')) return;
                if (ttl) {
                    await redis.set(key, value, { ex: ttl });
                } else {
                    await redis.set(key, value);
                }
            },
            delete: async (key) => {
                if (key.startsWith('betterauth:jwks')) return;
                await redis.del(key);
            },
        },

        advanced: {
            defaultCookieAttributes: {
                sameSite: "none",
                secure: true
            }
        },

        plugins: [
            openAPI(),
            jwtPlugin(env),
            bearer(),
        ],

        session: {
            cookieCache: {
                enabled: true,
                maxAge: 30 * 60,
            },
        },

        emailAndPassword: {
            enabled: true,
        },

        socialProviders: {
            google: {
                clientId: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
            },
            github: {
                clientId: env.GITHUB_CLIENT_ID,
                clientSecret: env.GITHUB_CLIENT_SECRET,
            },
            discord: {
                clientId: env.DISCORD_CLIENT_ID,
                clientSecret: env.DISCORD_CLIENT_SECRET,
            },
        },
    };
};
