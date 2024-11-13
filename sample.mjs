import { neon, neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';

const connectionString = 'postgres://postgres:postgres@db.localtest.me:5432/main';

/* Using single SQL query */

neonConfig.fetchEndpoint = (host) => {
  const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
  return `${protocol}://${host}:${port}/sql`;
};

const sql = neon(connectionString);
const [result] = await sql`SELECT * FROM NOW()`;

console.log(result);

/* or using Pool */

neonConfig.wsProxy = (host) => host === 'db.localtest.me' ? `${host}:4444/v1` : undefined;
neonConfig.useSecureWebSocket = false; // only for local development
neonConfig.webSocketConstructor = ws; // when using Node.js

const pool = new Pool({ connectionString });
const { rows } = await pool.query('SELECT * FROM NOW()');

console.log(rows[0]);

await pool.end();
