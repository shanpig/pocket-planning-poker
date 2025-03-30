#!/bin/bash

source .env 

echo "========== ngrok =========="

if ! command -v ngrok &> /dev/null
then
    echo -e "| Ngrok: \t ngrok could not be found. Please install ngrok to proceed."
    exit 1
fi
if [ -z "$NGROK_AUTHTOKEN" ]
then
    echo -e "| ngrok token: \t Token is not set in the .env file. Please set it to proceed."
    exit 1
else
    result=$(ngrok config check)
    if grep -q "Valid configuration" <<< $result
    then
        echo -e "| ngrok token: \t Token is already set."
    else
        echo -e "| ngrok token: \t Setting ngrok authtoken..."
        ngrok authtoken $NGROK_AUTHTOKEN
    fi
fi

ngrok_api_origin=$(grep web_addr "$(ngrok config check | grep -e "Valid configuration file" | sed s/"Valid configuration file at "//g)" | xargs | sed s/"web_addr: "//g)

# add fallback value to ngrok api origin
# ref: https://stackoverflow.com/questions/30120079/insert-variable-value-or-default-value-if-empty-in-a-string
: ${ngrok_api_origin:="localhost:4040"}

echo -e "| ngrok api: \t $ngrok_api_origin"

ngrok http "http://localhost:$EXPOSED_PORT" > /dev/null &

# wait for ngrok tunnel to spin up
until curl -s "http://$ngrok_api_origin/api/tunnels" > /dev/null; do
    sleep 1
done

exposed_url=$(curl -s "http://$ngrok_api_origin/api/tunnels" | jq ".tunnels[0].public_url")

echo -e "| ngrok website: $exposed_url"

echo "========== ngrok =========="

npm run docker:up

trap 'echo "SIGINT received, closing ngrok..."; pkill ngrok; exit' SIGINT