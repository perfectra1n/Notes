# Build stage
FROM node:20.15.1-bullseye-slim AS build

# Configure system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    autoconf \
    automake \
    g++ \
    gcc \
    libtool \
    make \
    nasm \
    libpng-dev \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .
COPY server-package.json package.json

# Copy TypeScript build artifacts into the original directory structure.
# Copy the healthcheck
RUN cp -R build/src/* src/. && \
    cp build/docker_healthcheck.js . && \
    rm -r build && \
    rm docker_healthcheck.ts

# Install app dependencies and build
RUN npm install && \
    npm run webpack && \
    cp src/public/app/share.js src/public/app-dist/. && \
    cp -r src/public/app/doc_notes src/public/app-dist/. && \
    rm -rf src/public/app && rm src/services/asset_path.ts

# Runtime stage
FROM node:20.15.1-bullseye-slim

# Install only necessary runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gosu \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy the entire app directory from build stage
COPY --from=build /usr/src/app .

# Install production dependencies only
RUN npm ci --only=production && \
    npm prune --omit=dev

# Start the application
EXPOSE 8080
CMD [ "./start-docker.sh" ]

HEALTHCHECK --start-period=10s CMD exec gosu node node docker_healthcheck.js