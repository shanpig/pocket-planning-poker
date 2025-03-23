#!/bin/bash

docker compose up -d

trap "echo 'Shutting down container gracefully...'; docker compose down; exit" INT

ssh -R 80:localhost:6789 localhost.run

docker compose down