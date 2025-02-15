import { Hono } from 'hono';
import pg from 'pg';

import { envOrThrow } from '@/env';

const client = new pg.Client(envOrThrow('DATABASE_URL'));
await client.connect();

export default new Hono().post('/query', async (c) => {
  const { sql, params, method } = await c.req.json();

  // prevent multiple queries
  const sqlBody = sql.replace(/;/g, '');

  try {
    const result =
      method === 'all'
        ? await client.query({ text: sqlBody, values: params, rowMode: 'array' })
        : await client.query({ text: sqlBody, values: params });

    return c.json(result.rows);
  } catch (e: any) {
    return c.json({ error: e });
  }
});
