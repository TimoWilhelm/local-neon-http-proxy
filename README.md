# Connect to a local PostgreSQL database using the neon http proxy

This repository contains a Dockerfile to run the neon proxy locally. It basically implements the steps described in [neondatabase/serverless/issues/33](https://github.com/neondatabase/serverless/issues/33#issuecomment-1634853042).

The proxy uses [localtest.me](https://readme.localtest.me/) to configure the TLS server name and includes a small [Caddy](https://caddyserver.com/) reverse proxy to setup the upstream connection via HTTPS so the local code does not need to trust the self-signed certificate of the neon proxy.

## Usage

The latest version is hosted on the GitHub Container Registry and can be pulled from `ghcr.io/timowilhelm/local-neon-http-proxy:main`.

### Local setup
To use the proxy you need to provide a connection string to a PostgreSQL database. The easiest setup is to use a `docker-compose.yml` file that starts a PostgreSQL database and the local neon proxy.

```yaml
version: '3'

services:
  postgres:
    image: postgres:15
    command: '-d 1' # set debug-level
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=main
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

  neon-proxy:
    image: ghcr.io/timowilhelm/local-neon-http-proxy:main
    environment:
      - PG_CONNECTION_STRING=postgres://postgres:postgres@postgres:5432/main
    ports:
      - '4444:4444'
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  db_data:

```

### Connecting to the neon proxy
When using the local proxy you need to add a custom fetchEndpoint function to the neonConfig. The local proxy listens on `http://db.localtest.me:4444/sql`.

```js
import { neon, neonConfig } from '@neondatabase/serverless';

const connectionString = 'postgres://postgres:postgres@db.localtest.me:5432/main';

neonConfig.fetchEndpoint = (host) => {
  const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
  return `${protocol}://${host}:${port}/sql`;
};

const sql = neon(connectionString);
const [result] = await sql`SELECT * FROM NOW()`;
```

## Developing
1. Clone this repository
2. Run `docker-compose up` to start the PostgreSQL database and the neon http proxy (building the Docker image for the first time might take a while)
3. Run `npm install` to install the dependencies
4. Run `npm test` to run the sample to validate the connection to the database works