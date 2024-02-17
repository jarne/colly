# docker container build file
# for: Colly
# created in: 2024 by: @jarne

# Begin with Node.js LTS container image
FROM node:20

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

# Install dependecies with Yarn
RUN yarn install --immutable

# Go to static client source folder
WORKDIR /app/client

# Install dependecies with Yarn and build client
RUN yarn install --immutable
RUN yarn build

# Switch back to app source folder
WORKDIR /app

# Start the application
CMD ["yarn", "start:prod"]

# Open application ports
EXPOSE 3000
