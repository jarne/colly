#!/bin/sh

# Commands to execute when starting Colly Docker container

# Run initial user creation check script
yarn node userInit.js

# Run Node.js application
yarn start
