#!/bin/sh

# Start cron service
service cron start

# Start the SSH tunnel with autossh in the background
autossh -M 0 -o "StrictHostKeyChecking=no" -o "UserKnownHostsFile=/dev/null" root@alexa.mehdi.cloud -L 27017:127.0.0.1:27017 -N &

# Run the main application (Next.js)
yarn start
