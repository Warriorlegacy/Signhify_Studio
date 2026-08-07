FROM oven/bun:1-alpine
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code and build
COPY . .
RUN bun run build

# Expose port
EXPOSE 3001

# Production env defaults
ENV PORT=3001
ENV HOST=0.0.0.0
ENV HUNTER_DB_PATH=/app/data/hunter.db

# Mount persistent data directory for SQLite database
VOLUME ["/app/data"]

# Run clienthunter web dashboard & autonomous engine
CMD ["bun", "run", "dev"]
