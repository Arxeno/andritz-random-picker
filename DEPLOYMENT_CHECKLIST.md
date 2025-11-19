# Deployment Checklist - Quick Start

Use this checklist to deploy your Andritz Random Picker app to production.

## ✅ Pre-Deployment Checklist

- [ ] Code is committed and pushed to Git repository
- [ ] All features tested locally
- [ ] Admin user credentials documented
- [ ] Environment variables documented
- [ ] No console errors in development
- [ ] All TypeScript errors resolved

## 🚀 Deployment Steps

### Step 1: Deploy Convex Backend (5 minutes)

```bash
# 1. Deploy to Convex Cloud
npx convex deploy

# 2. Create admin user in production
npx convex run setup:createAdminUser --prod

# 3. Verify admin user
npx convex run setup:checkAdminUser --prod

# 4. Open dashboard to configure environment variables
npx convex dashboard
```

**In Convex Dashboard**:
- [ ] Add `SITE_URL` environment variable (will update after frontend deployment)
- [ ] Note down your Convex production URL: `https://__________.convex.cloud`

### Step 2: Deploy Next.js Frontend to Vercel (5 minutes)

**Option A: Via Vercel Dashboard** (Recommended)

1. [ ] Go to https://vercel.com
2. [ ] Click "Add New" → "Project"
3. [ ] Import your Git repository
4. [ ] Configure project:
   - Framework: Next.js
   - Build Command: `pnpm build` (or `npm run build`)
   - Install Command: `pnpm install` (or `npm install`)
5. [ ] Add environment variable:
   - `NEXT_PUBLIC_CONVEX_URL` = Your Convex production URL
6. [ ] Click "Deploy"
7. [ ] Wait for deployment to complete
8. [ ] Note down your Vercel URL: `https://__________.vercel.app`

**Option B: Via CLI**

```bash
# 1. Install Vercel CLI (if not installed)
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Add environment variable
vercel env add NEXT_PUBLIC_CONVEX_URL production
# Paste your Convex production URL when prompted

# 5. Redeploy with environment variables
vercel --prod
```

### Step 3: Update Convex with Frontend URL (2 minutes)

1. [ ] Go to Convex Dashboard: https://dashboard.convex.dev
2. [ ] Select your project
3. [ ] Go to Settings → Environment Variables
4. [ ] Update `SITE_URL` to your Vercel URL
5. [ ] Save changes

### Step 4: Verify Deployment (5 minutes)

Visit your production URL and test:

- [ ] Home page loads
- [ ] Can sign in with admin credentials
- [ ] Dashboard shows correct stats
- [ ] Can view participants page
- [ ] Can view prizes page
- [ ] Can access spin page
- [ ] QR code page works (`/register-qr`)
- [ ] Public registration works (`/register`)
- [ ] Can register a test participant
- [ ] Data persists correctly
- [ ] No console errors

## 📝 Post-Deployment

- [ ] Document production URLs:
  - Frontend: `https://__________.vercel.app`
  - Backend: `https://__________.convex.cloud`
- [ ] Share URLs with team/users
- [ ] Test QR code scanning with phone
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/alerts (optional)

## 🔑 Important URLs

| Service | URL | Notes |
|---------|-----|-------|
| Production App | `https://__________.vercel.app` | Main application |
| QR Code Display | `https://__________.vercel.app/register-qr` | For projector |
| Registration | `https://__________.vercel.app/register` | Public registration |
| Convex Dashboard | https://dashboard.convex.dev | Backend management |
| Vercel Dashboard | https://vercel.com/dashboard | Frontend management |

## 🆘 Quick Troubleshooting

### "Convex connection failed"
```bash
# Check environment variable in Vercel
vercel env ls

# Should show: NEXT_PUBLIC_CONVEX_URL
```

### "Authentication not working"
- Verify `SITE_URL` in Convex matches Vercel URL
- Check admin user exists: `npx convex run setup:checkAdminUser --prod`

### "Build failed"
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run lint
```

## 🔄 Redeployment

### Update Backend
```bash
npx convex deploy
```

### Update Frontend
- **Automatic**: Push to main branch
- **Manual**: `vercel --prod`

## 📞 Support

- **Convex**: https://convex.dev/community
- **Vercel**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs

---

**Total Time**: ~15-20 minutes
**Difficulty**: Easy
**Prerequisites**: Convex account, Vercel account, Git repository

