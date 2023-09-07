import { neon, neonConfig } from '@neondatabase/serverless';

const connectionString = 'postgres://postgres:postgres@db.localtest.me:5432/main';

neonConfig.fetchEndpoint = (host) => {
  const protocol = host === 'db.localtest.me' ? 'http' : 'https';
  const port = host === 'db.localtest.me' ? 4444 : 443;
  return `${protocol}://${host}:${port}/sql`;
};

const sql = neon(connectionString);
const [result] = await sql`SELECT * FROM NOW()`;

console.log(result);
