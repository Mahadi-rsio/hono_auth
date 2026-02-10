

import { createRedis } from './redis.js';
import type { Jwk } from 'better-auth/plugins';
import { jwt } from 'better-auth/plugins';
import type { Env } from './env.types.js';

const JWKS_KEY = 'betterauth:jwks';

export const jwtPlugin = (env: Env) =>
    jwt({
        adapter: {
            getJwks: async () => {
                const redis = createRedis(env);
                const data = await redis.lrange(JWKS_KEY, 0, -1);
                if (!data.length) return [];

                return data.map((item) => {
                    const parsed = item === "string" ? JSON.parse(item) : item
                    if (parsed.createdAt) parsed.createdAt = new Date(parsed.createdAt);
                    if (parsed.expiresAt) parsed.expiresAt = new Date(parsed.expiresAt);
                    return parsed as Jwk;
                });
            },

            createJwk: async (data: Omit<Jwk, 'id'>, _ctx) => {
                const redis = createRedis(env);
                const jwk: Jwk = {
                    id: crypto.randomUUID(),
                    publicKey: data.publicKey,
                    privateKey: data.privateKey,
                    createdAt: data.createdAt ?? new Date(),
                    expiresAt: data.expiresAt,
                    alg: data.alg ?? 'EdDSA',
                    crv: data.crv ?? 'Ed25519',
                };

                await redis.lpush(JWKS_KEY, JSON.stringify(jwk));
                await redis.ltrim(JWKS_KEY, 0, 4); // keep last 5 keys

                return jwk;
            },
        },

        jwt: {
            expirationTime: '7d',
        },
    });
