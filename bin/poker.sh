#!/bin/bash

source .env 

docker compose up -d

trap "echo 'Shutting down container gracefully...'; docker compose down --remove-orphans; exit" INT

if ! command -v ngrok &> /dev/null
then
    echo "ngrok could not be found. Please install ngrok to proceed."
    exit 1
fi
if [ -z "$NGROK_AUTHTOKEN" ]
then
    echo "NGROK_AUTHTOKEN is not set in the .env file. Please set it to proceed."
    exit 1
else
    result=$(ngrok config check)
    if grep -q "Valid configuration" <<< $result
    then
        echo "NGROK_AUTHTOKEN is already set."
    else
        echo "Setting ngrok authtoken..."
        ngrok authtoken $NGROK_AUTHTOKEN
    fi
fi

ngrok http "http://localhost:$EXPOSED_PORT"