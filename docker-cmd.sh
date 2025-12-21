#!/bin/sh

# Commands to execute when starting Colly Docker container

# Run initial user creation check script
pnpm run init:user

# Run Node.js application
pnpm run start
