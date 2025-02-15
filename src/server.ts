import { serve } from '@hono/node-server';

import app from '@/app';
import { env } from '@/env';

const HOST = env('HOST') || '0.0.0.0';
const PORT = Number(env('PORT')) || 5174;

serve({ hostname: HOST, port: PORT, fetch: app.fetch }, (info) => {
  console.log(`[${process.pid}] Listening on http://${info.address}:${info.port}`);
});
