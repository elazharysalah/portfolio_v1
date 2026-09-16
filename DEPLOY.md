# Deploy to Hostinger VPS — elazharysalah.com

Deploy with **Docker Compose** (Next.js + Postgres + Nginx) on your Hostinger VPS.

## 1. DNS (Hostinger domain panel)

Point these records to your VPS public IP:

| Type | Name | Value |
|------|------|--------|
| A | `@` | `YOUR_VPS_IP` |
| A | `www` | `YOUR_VPS_IP` |

Wait until DNS resolves (`ping elazharysalah.com`).

## 2. VPS prerequisites

```bash
ssh root@YOUR_VPS_IP
```

```bash
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh
apt install -y git
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw --force enable
```

## 3. Get the code on the VPS

```bash
mkdir -p /var/www
cd /var/www
git clone YOUR_REPO_URL portfolio
cd portfolio
```

Or upload the project with SFTP/SCP to `/var/www/portfolio`.

## 4. Production env

```bash
cp .env.production.example .env.production
nano .env.production
```

Set strong values for:

- `POSTGRES_PASSWORD` (**required**)
- `NEXTAUTH_SECRET` (long random string, 32+ chars)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)

Keep:

```env
NEXTAUTH_URL=https://elazharysalah.com
```

Important: always pass the env file to Compose (otherwise Postgres gets an empty password):

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ...
```

## 5. First start (HTTP) + SSL certificate

```bash
mkdir -p deploy/certbot/www deploy/certbot/conf
cp deploy/nginx/elazharysalah.com.http.conf deploy/nginx/elazharysalah.com.active.conf
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Open `http://elazharysalah.com` to verify the app.

Issue certificates:

```bash
docker run --rm -it \
  -v "$(pwd)/deploy/certbot/www:/var/www/certbot" \
  -v "$(pwd)/deploy/certbot/conf:/etc/letsencrypt" \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d elazharysalah.com -d www.elazharysalah.com \
  --email admin@elazharysalah.com \
  --agree-tos --no-eff-email
```

## 6. Switch to HTTPS

```bash
cp deploy/nginx/elazharysalah.com.conf deploy/nginx/elazharysalah.com.active.conf
docker compose --env-file .env.production -f docker-compose.prod.yml exec nginx nginx -s reload
```

Visit:

- https://elazharysalah.com
- https://elazharysalah.com/admin

## 7. Seed content (first deploy only)

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml exec app npx tsx prisma/seed.ts
```

Copy uploaded images from your PC:

```bash
# on PC
scp -r public/uploads root@YOUR_VPS_IP:/tmp/portfolio-uploads
```

```bash
# on VPS
docker cp /tmp/portfolio-uploads/. portfolio-app:/app/public/uploads/
```

## 8. Updates later

```bash
cd /var/www/portfolio
git checkout -- Dockerfile
git pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

## Fix right now (your current VPS errors)

Run these on the VPS:

```bash
cd /var/www/portfolio

# A) Create/fix env (POSTGRES_PASSWORD must NOT be empty)
cp -n .env.production.example .env.production
nano .env.production
# set POSTGRES_PASSWORD, NEXTAUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# B) Unblock git pull (discard local Dockerfile edit)
git checkout -- Dockerfile
git pull

# C) Recreate everything with env file
# -v deletes empty/broken DB volume from the failed first start (OK now)
docker compose --env-file .env.production -f docker-compose.prod.yml down -v
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build

# D) Wait until healthy, then seed
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml exec app npx tsx prisma/seed.ts
```

## Useful commands

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f db
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f app
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

## Notes

- Do **not** commit `.env.production`.
- Uploads persist in Docker volume `uploads`.
- Hostinger firewall must allow **80** and **443**.
