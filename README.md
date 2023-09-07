# Sample project how to connect to a local PostgreSQL database using the neon http proxy

This repository contains a Dockerfile to run the neon proxy locally. It basically implements the steps described in [neondatabase/serverless/issues/33](https://github.com/neondatabase/serverless/issues/33#issuecomment-1634853042).

The container also includes a small [Caddy](https://caddyserver.com/) reverse proxy to setup the upstream connection via HTTPS so the local code does not need to trust the self-signed certificate of the neon proxy.

## Setup
1. Clone this repository
2. Run `docker-compose up` to start the PostgreSQL database and the neon http proxy (building the Docker image for the first time might take a while)
3. Run `npm install` to install the dependencies
4. Run `npm test` to run the sample to validate the connection to the database works