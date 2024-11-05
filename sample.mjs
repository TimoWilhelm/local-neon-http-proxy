import { neon, neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';

const connectionString = 'postgres://postgres:postgres@db.localtest.me:5432/main';

neonConfig.fetchEndpoint = (host) => {
  const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
  return `${protocol}://${host}:${port}/sql`;
};

neonConfig.wsProxy = (host) => `${host}:4444/v1`;
neonConfig.useSecureWebSocket = false;
neonConfig.pipelineTLS = false;
neonConfig.pipelineConnect = false;
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString });
const { rows } = await pool.query('SELECT * FROM NOW()');

console.log(rows[0]);

const sql = neon(connectionString);
const [result] = await sql`SELECT * FROM NOW()`;

console.log(result);
