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

- `POSTGRES_PASSWORD`
- `NEXTAUTH_SECRET` (long random string, 32+ chars)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)

Keep:

```env
NEXTAUTH_URL=https://elazharysalah.com
```

## 5. First start (HTTP) + SSL certificate

`elazharysalah.com.active.conf` starts as the HTTP bootstrap config.

```bash
mkdir -p deploy/certbot/www deploy/certbot/conf
cp deploy/nginx/elazharysalah.com.http.conf deploy/nginx/elazharysalah.com.active.conf
docker compose -f docker-compose.prod.yml up -d --build
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
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

Visit:

- https://elazharysalah.com
- https://elazharysalah.com/admin

## 7. Seed content (first deploy only)

This loads your exported local content (profile, case studies, etc.):

```bash
docker compose -f docker-compose.prod.yml exec app npx tsx prisma/seed.ts
```

Also copy your local uploaded images/resume to the server volume (if you used Admin uploads):

```bash
# From your PC (example)
scp -r public/uploads/* root@YOUR_VPS_IP:/var/www/portfolio/public/uploads/
```

Or after containers are up, copy into the running volume:

```bash
docker cp ./public/uploads/. portfolio-app:/app/public/uploads/
```

## 8. Updates later

```bash
cd /var/www/portfolio
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## 9. Useful commands

```bash
docker compose -f docker-compose.prod.yml logs -f app
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml down
```

## 10. Renew SSL (monthly cron)

```bash
docker run --rm \
  -v /var/www/portfolio/deploy/certbot/www:/var/www/certbot \
  -v /var/www/portfolio/deploy/certbot/conf:/etc/letsencrypt \
  certbot/certbot renew

cd /var/www/portfolio
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## Checklist

- [ ] DNS A records for `@` and `www`
- [ ] `.env.production` secrets set
- [ ] Containers running
- [ ] SSL issued + HTTPS config active
- [ ] Seeded once
- [ ] Admin works at `/admin`

## Notes

- Do **not** commit `.env.production`.
- Uploads persist in Docker volume `uploads`.
- Hostinger firewall must allow **80** and **443**.
- Prefer a GitHub repo so future updates are `git pull` + rebuild.
