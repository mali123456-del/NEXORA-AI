# NEXORA AI — Production Deployment Guide

## 1. Prerequisites & Environment Setup
- **Node.js**: v20 or v22+
- **Environment Variables**:
  - `GEMINI_API_KEY`: Attached server-side in AI Studio Secrets panel.
  - `PORT`: Set to `3000` (defaults to 3000 if omitted).
  - `NODE_ENV`: Set to `production` for static asset serving or `development` for live Vite middleware.

## 2. Full-Stack Build Commands
```bash
# 1. Install production dependencies
npm install

# 2. Compile frontend assets
npm run build

# 3. Verify TypeScript types
npm run lint

# 4. Launch Full-Stack Express Server
npm run start
```

## 3. Containerization (Dockerfile)
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
EXPOSE 3000
CMD ["npx", "tsx", "server.ts"]
```

## 4. Security Hardening in Production
- Ensure incoming reverse proxy strips `Server` and `X-Powered-By` headers.
- Route outbound scanner requests through egress proxies with blocked private CIDR blocks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.169.254`).
- Maintain immutable append-only logs for all pentesting scan operations.
