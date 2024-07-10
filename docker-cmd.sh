#!/bin/sh

# Commands to execute when starting Colly Docker container

# Build client to have up-to-date customization with env variables
cd client
yarn build
cd ..

# Run initial user creation check script
node userInit.js

# Run Node.js application
yarn start
