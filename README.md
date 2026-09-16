# Salah Eddine El-Azhary — Portfolio + Admin CMS

Dark, responsive portfolio inspired by [iabhinav.me](https://iabhinav.me/), with a Postgres-backed admin dashboard to manage all content.

### Open on your phone (same Wi‑Fi)

`172.20.112.1` is a WSL/virtual adapter — phones cannot use it.

1. Run `npm run dev` (binds to `0.0.0.0`).
2. On your PC, check your **Wi‑Fi** IPv4 (example: `192.168.3.57`).
3. Put that IP in `.env` as `ALLOWED_DEV_ORIGINS=192.168.3.57` (required so tabs/buttons work on phone).
4. Restart `npm run dev`, then on your phone open: `http://YOUR_WIFI_IP:3000`
5. If it still fails, allow Node.js / port **3000** in Windows Firewall when prompted (Private networks).

Phone and PC must be on the same Wi‑Fi (not guest/VPN).

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Prisma + PostgreSQL
- NextAuth credentials login for `/admin`
- Local uploads under `public/uploads`

## Quick start (local)

### 1. Install

```bash
npm install
```

### 2. Start Postgres

Requires Docker:

```bash
npm run db:up
```

### 3. Env

Copy `.env.example` to `.env` (already present for local defaults):

```env
DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-me"
ADMIN_EMAIL="admin@salah.dev"
ADMIN_PASSWORD="admin123"
```

### 4. Migrate + seed

```bash
npm run db:setup
```

This loads profile, experience, education, skills, projects, and gallery from the CV seed.

### 5. Run

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Default login: `admin@salah.dev` / `admin123`

## Admin features

- Profile (bio HTML, avatar, resume, socials)
- Highlights, Experience, Education, Skills
- Projects (featured flag) & Gallery uploads
- Contact messages inbox
- Section titles / site settings

## Google Analytics (GA4)

1. Create a GA4 property in [Google Analytics](https://analytics.google.com/).
2. Copy your Measurement ID (`G-XXXXXXXXXX`).
3. Set it in `.env`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

4. Restart `npm run dev` (or redeploy). Leave it empty to disable tracking.

## Deploy (Hostinger VPS — elazharysalah.com)

Full guide: [DEPLOY.md](./DEPLOY.md)

Quick overview:

1. Point DNS `A` records for `@` and `www` to your VPS IP.
2. On the VPS: install Docker, clone/upload the project to `/var/www/portfolio`.
3. Copy `.env.production.example` → `.env.production` and set secrets.
4. `docker compose -f docker-compose.prod.yml up -d --build`
5. Issue SSL with Certbot, then switch nginx to HTTPS (steps in DEPLOY.md).
6. Seed once: `docker compose -f docker-compose.prod.yml exec app npx tsx prisma/seed.ts`

## Deploy (Neon + Vercel)

1. Create a Neon (or Supabase/Railway) Postgres database.
2. Set `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel.
3. Deploy the repo.
4. Run once against production DB:

```bash
npx prisma db push
npm run db:seed
```

> Uploaded files are stored on the local filesystem (`public/uploads`). For production, switch uploads to S3/Cloudinary if you use ephemeral hosting.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run db:up` | Start Docker Postgres |
| `npm run db:setup` | Push schema + seed |
| `npm run db:seed` | Re-seed CV content |
| `npm run build` | Production build |
