# docker container build file
# for: Colly
# created in: 2024 by: @jarne

# Begin with Node.js LTS container image
FROM node:24

# Enable Pnpm
RUN corepack enable pnpm

# Create and switch to app source folder
WORKDIR /app

# Gain permissions to the app user for the created source folder
RUN chown node:node /app

# Add app source code and set permissions to application user
COPY --chown=node:node ./ ./

# Switch to non-root user
USER node

# Switch to app source folder
WORKDIR /app

# Install dependecies and build back-end
RUN CI=true pnpm install --frozen-lockfile
RUN pnpm run build

# Go to static client source folder
WORKDIR /app/client

# Install dependecies and build client
RUN CI=true pnpm install --frozen-lockfile
RUN pnpm run build

# Switch back to app source folder
WORKDIR /app

# Run startup commands
CMD ["/bin/sh", "docker-cmd.sh"]

# Open application ports
EXPOSE 3000
