# 🚀 ClientHunter Production Deployment & Security Guide

This document outlines how to deploy **ClientHunter** to production on your studio VPS/server, secured specifically so **only you (the founder)** can access it.

---

## 🔒 Security Architecture (Founder-Only Access)

ClientHunter has been updated with **Founder Basic Authentication** built into `src/server.ts`:
- **Public Route**: `/unsubscribe` remains publicly accessible so email recipients can opt out in 1 click (CAN-SPAM requirement).
- **Protected Routes**: All dashboard interfaces (`/`, `/leads`, `/sources`, `/campaigns`, `/inbox`, `/settings`, `/api/*`) require authentication matching `HUNTER_ADMIN_PASSWORD`.
- **Default Founder Password**: `SignhifyAdmin2026!` (override with environment variable `HUNTER_ADMIN_PASSWORD`).

---

## 🛠️ Recommended Deployment Setup (Bun Persistent VPS / Docker)

ClientHunter uses Bun and SQLite (`bun:sqlite` with WAL mode stored at `data/hunter.db`). It runs best on a persistent VPS (Ubuntu / Debian / Docker) or on your studio server.

### Option A: Docker Deployment (Recommended)

1. **Build Docker Image** inside `d:\Signhify\hunter`:

```dockerfile
# Dockerfile
FROM oven/bun:1-alpine
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
EXPOSE 3001
ENV HUNTER_DB_PATH=/app/data/hunter.db
VOLUME ["/app/data"]
CMD ["bun", "run", "start"]
```

2. **Run Container with Mounted SQLite Volume & Env Vars**:

```bash
docker run -d \
  --name clienthunter \
  --restart always \
  -p 3001:3001 \
  -v /var/clienthunter/data:/app/data \
  -e HUNTER_SITE_URL="https://hunter.signhify.dpdns.org" \
  -e HUNTER_ADMIN_PASSWORD="YourSecretPassword2026!" \
  -e HUNTER_SANDBOX="false" \
  -e HUNTER_RESEND_API_KEY="re_123456789..." \
  -e HUNTER_FROM_EMAIL="Piyush@signhify.dev" \
  -e HUNTER_FROM_NAME="Piyush — Signhify Studio" \
  -e HUNTER_PHYSICAL_ADDRESS="Signhify AI Studio, 16192 Coastal Hwy, Lewes, DE 19958, USA" \
  clienthunter:latest
```

---

### Option B: PM2 Systemd Service on Linux VPS

1. Clone repo to server: `/var/www/hunter`
2. Install dependencies & build:

```bash
cd /var/www/hunter
bun install
bun run build
```

3. Create `.env`:

```env
HUNTER_SITE_URL=https://hunter.signhify.dpdns.org
HUNTER_ADMIN_PASSWORD=YourSecretPassword2026!
HUNTER_SANDBOX=false
HUNTER_RESEND_API_KEY=re_123456789...
HUNTER_FROM_EMAIL=Piyush@signhify.dev
HUNTER_FROM_NAME=Piyush — Signhify Studio
HUNTER_PHYSICAL_ADDRESS=Signhify AI Studio, 16192 Coastal Hwy, Lewes, DE 19958, USA
```

4. Run background workers with PM2:

```bash
# Start Web Server & Engine
pm2 start "bun run start" --name "clienthunter-web"

# Start Standalone Queue Worker (optional 24/7 background worker)
pm2 start "bun scripts/worker.ts" --name "clienthunter-worker"

pm2 save
```

---

## 🌐 Nginx Reverse Proxy with SSL (`hunter.signhify.dpdns.org`)

```nginx
server {
    listen 80;
    server_name hunter.signhify.dpdns.org;
    return 310 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hunter.signhify.dpdns.org;

    ssl_certificate /etc/letsencrypt/live/hunter.signhify.dpdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hunter.signhify.dpdns.org/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## ✅ Deployment Checklist

- [x] Founder Basic Auth enabled in `src/server.ts`.
- [x] Unsubscribe endpoint `/unsubscribe` exempted for CAN-SPAM compliance.
- [x] SQLite WAL database persistence configured at `/app/data/hunter.db`.
- [ ] Set `HUNTER_SANDBOX=false` in production environment variables.
- [ ] Add `HUNTER_RESEND_API_KEY` for live outreach email sending.
- [ ] Add `HUNTER_ADMIN_PASSWORD` to secure dashboard access.
