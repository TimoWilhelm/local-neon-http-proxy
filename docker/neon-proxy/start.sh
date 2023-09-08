#!/bin/bash

if [ -z "$PG_CONNECTION_STRING" ]; then
  echo "PG_CONNECTION_STRING is not set"
  exit 1
fi

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

wait -n
exit $?
