#!/bin/bash

# Forward SIGTERM to child processes
trap 'kill -TERM $(jobs -p) 2>/dev/null' TERM

if [ -z "$PG_CONNECTION_STRING" ]; then
  echo "PG_CONNECTION_STRING is not set"
  exit 1
fi

# Create required tables
psql -Atx $PG_CONNECTION_STRING \
  -c "CREATE SCHEMA IF NOT EXISTS neon_control_plane" \
  -c "CREATE TABLE neon_control_plane.endpoints (endpoint_id VARCHAR(255) PRIMARY KEY, allowed_ips VARCHAR(255))"

# Start the neon-proxy
./neon-proxy \
  -c server.pem \
  -k server.key \
  --auth-backend=postgres \
  --auth-endpoint=$PG_CONNECTION_STRING \
  --wss=0.0.0.0:4445 \
  &

# Start caddy reverse proxy
caddy run \
  --config ./Caddyfile \
  --adapter caddyfile \
  &

wait
