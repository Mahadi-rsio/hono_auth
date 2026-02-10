import { Hono } from 'hono';
import { createAuth } from './lib/auth/index.js';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Env } from './lib/auth/env.types.js'


const app = new Hono<{ Bindings: Env }>();

app.use(logger());

app.use(
    '/api/auth/*', // or replace with "*" to enable cors for all routes
    cors({
        origin: 'http://localhost:5173', // replace with your origin
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS'],
        exposeHeaders: ['Content-Length'],
        maxAge: 600,
        credentials: true,
    }),
);

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
    const auth = createAuth(c.env)
    return auth.handler(c.req.raw);
});

app.get('/', (c) => {

    return c.text(c.env.HI);
});

export default app;
