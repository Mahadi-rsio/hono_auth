import { Redis } from '@upstash/redis/cloudflare'
import { Env } from './env.types.js';

export const createRedis = (env: Env) => new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN
});
