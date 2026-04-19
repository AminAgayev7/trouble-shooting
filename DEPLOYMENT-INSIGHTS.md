# Deployment Insights

## What I Learned

Deploying a Next.js application to production is more than just running `npm run build`. 
This project taught me the full lifecycle of enterprise deployment.

## Key Challenges & Solutions

**1. Prisma on Vercel**
Vercel caches dependencies, so Prisma Client was outdated on every deploy.
Solution: Added `prisma generate` to the build script.

**2. Next.js 15 Params Type Change**
Dynamic route handlers broke because `params` is now a `Promise` in Next.js 15+.
Solution: Updated all `[id]/route.ts` files to use `Promise<{ id: string }>`.

**3. Middleware Redirect Loop**
Middleware was intercepting `/auth/login` itself, causing infinite redirects.
Solution: Added a `matcher` config to exclude auth routes from middleware.

## CI/CD Pipeline
Every push to `main` automatically runs:
- TypeScript type check
- ESLint
- Production build
- Security vulnerability audit

## Security Measures
- Security headers: `X-Frame-Options`, `HSTS`, `X-Content-Type-Options`
- Hardcoded secret detection in CI
- Weekly automated dependency vulnerability scans
- Environment variables managed via Vercel dashboard

## Environment Strategy
- `.env` — local only, never committed
- `.env.example` — committed, placeholders only
- Production secrets — stored in Vercel Environment Variables