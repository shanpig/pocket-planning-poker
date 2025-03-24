#!/bin/bash

source .env 

docker compose up -d

trap "echo 'Shutting down container gracefully...'; docker compose down; exit" INT

ngrok http "http://localhost:$EXPOSED_PORT"

docker compose down --remove-orphans