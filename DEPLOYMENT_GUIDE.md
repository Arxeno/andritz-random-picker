# Deployment Guide - Andritz Random Picker

This guide will walk you through deploying your Convex + Next.js application to production.

## Overview

Your application consists of two parts:
1. **Convex Backend** - Database and server functions (deployed to Convex Cloud)
2. **Next.js Frontend** - Web application (deployed to Vercel or similar)

## Prerequisites

Before deploying, ensure you have:
- [x] A Convex account (sign up at https://convex.dev)
- [x] A Vercel account (sign up at https://vercel.com) - recommended for Next.js
- [x] Git repository (your code should be pushed to GitHub/GitLab/Bitbucket)
- [x] All environment variables documented

## Part 1: Deploy Convex Backend to Production

### Step 1: Create Production Deployment

1. **Open your terminal** in the project directory

2. **Deploy to Convex Cloud**:
   ```bash
   npx convex deploy
   ```

3. **Follow the prompts**:
   - If this is your first time, you'll be asked to log in
   - Select "Create a new project" or choose an existing one
   - Choose a project name (e.g., "andritz-random-picker-prod")

4. **Wait for deployment to complete**:
   ```
   ✓ Deployed Convex functions to production
   ✓ Your deployment URL: https://your-project.convex.cloud
   ```

### Step 2: Set Up Production Environment Variables

After deploying, you need to configure environment variables in Convex:

1. **Open Convex Dashboard**:
   ```bash
   npx convex dashboard
   ```
   Or visit: https://dashboard.convex.dev

2. **Navigate to your production deployment**:
   - Select your project
   - Click on "Settings" → "Environment Variables"

3. **Add required environment variables**:
   
   You'll need to set these in the Convex dashboard:
   
   - `SITE_URL` - Your production frontend URL (e.g., `https://your-app.vercel.app`)
   - Any other custom environment variables your app uses

   **Note**: Check your `.env.local` file to see what variables you're using locally.

### Step 3: Run Setup Scripts (if needed)

If you have setup scripts (like creating admin user), run them against production:

```bash
# Create admin user in production
npx convex run setup:createAdminUser --prod

# Check admin user
npx convex run setup:checkAdminUser --prod
```

### Step 4: Get Production Convex URL

After deployment, you'll receive a production Convex URL. You'll need this for your frontend:

```
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

Save this URL - you'll need it for the frontend deployment.

## Part 2: Deploy Next.js Frontend to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com
   - Click "Add New" → "Project"

2. **Import your Git repository**:
   - Connect your GitHub/GitLab/Bitbucket account
   - Select your repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `pnpm build` or `npm run build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `pnpm install` or `npm install`

4. **Add Environment Variables**:
   
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
   ```
   
   Add any other environment variables from your `.env.local` file that start with `NEXT_PUBLIC_`

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - You'll get a production URL like `https://your-app.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to production**:
   ```bash
   vercel --prod
   ```

4. **Follow the prompts**:
   - Set up and deploy? Yes
   - Which scope? (Select your account)
   - Link to existing project? No
   - What's your project's name? andritz-random-picker
   - In which directory is your code located? ./
   - Want to override the settings? No

5. **Add environment variables**:
   ```bash
   vercel env add NEXT_PUBLIC_CONVEX_URL production
   ```
   Then paste your Convex production URL

6. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

## Part 3: Update Convex with Production Frontend URL

After deploying your frontend, update Convex with the production URL:

1. **Go to Convex Dashboard**:
   - Visit https://dashboard.convex.dev
   - Select your project

2. **Update SITE_URL environment variable**:
   - Go to Settings → Environment Variables
   - Update `SITE_URL` to your Vercel URL (e.g., `https://your-app.vercel.app`)

3. **Redeploy Convex** (if needed):
   ```bash
   npx convex deploy
   ```

## Part 4: Verify Deployment

### Test Your Production App

1. **Visit your production URL**:
   ```
   https://your-app.vercel.app
   ```

2. **Test key features**:
   - [ ] Home page loads correctly
   - [ ] Can sign in with admin credentials
   - [ ] Can view participants
   - [ ] Can view prizes
   - [ ] Can spin the wheel
   - [ ] QR code page works (`/register-qr`)
   - [ ] Public registration works (`/register`)
   - [ ] Data persists correctly

3. **Check browser console**:
   - Open DevTools (F12)
   - Look for any errors
   - Verify Convex connection is working

4. **Test QR code**:
   - Navigate to `/register-qr`
   - Scan QR code with phone
   - Verify it redirects to production registration page

## Environment Variables Checklist

### Convex Dashboard (Production)
- [ ] `SITE_URL` - Your production frontend URL

### Vercel (Production)
- [ ] `NEXT_PUBLIC_CONVEX_URL` - Your Convex production URL

### Local Development (.env.local)
Keep these for local development:
- `NEXT_PUBLIC_CONVEX_URL` - Your Convex dev URL
- Any other local-only variables

## Continuous Deployment

### Automatic Deployments

Once set up, deployments are automatic:

**Frontend (Vercel)**:
- Push to `main` branch → Automatic deployment
- Push to other branches → Preview deployment

**Backend (Convex)**:
- Run `npx convex dev` → Deploys to dev environment
- Run `npx convex deploy` → Deploys to production

### Manual Deployments

**Redeploy Frontend**:
```bash
vercel --prod
```

**Redeploy Backend**:
```bash
npx convex deploy
```

## Troubleshooting

### Issue: "Convex connection failed"

**Solution**:
1. Check `NEXT_PUBLIC_CONVEX_URL` is set correctly in Vercel
2. Verify Convex deployment is successful
3. Check Convex dashboard for errors

### Issue: "Authentication not working"

**Solution**:
1. Verify `SITE_URL` in Convex matches your Vercel URL
2. Check auth configuration in `convex/auth.config.ts`
3. Ensure admin user is created in production

### Issue: "QR code shows wrong URL"

**Solution**:
1. QR code URL is generated client-side from `window.location.origin`
2. Should automatically use production URL
3. Clear browser cache and try again

### Issue: "Build fails on Vercel"

**Solution**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript has no errors: `npm run lint`
4. Check Node.js version compatibility

### Issue: "Environment variables not working"

**Solution**:
1. Ensure variables start with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding environment variables
3. Check variable names match exactly (case-sensitive)

## Custom Domain (Optional)

### Add Custom Domain to Vercel

1. **Go to Vercel Dashboard**:
   - Select your project
   - Go to "Settings" → "Domains"

2. **Add domain**:
   - Enter your domain (e.g., `random-picker.andritz.com`)
   - Follow DNS configuration instructions

3. **Update Convex**:
   - Update `SITE_URL` in Convex dashboard to your custom domain
   - Redeploy if needed

## Monitoring and Logs

### Vercel Logs

View deployment and runtime logs:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments" → Select deployment → "Logs"

### Convex Logs

View backend logs:
1. Go to Convex Dashboard
2. Select your project
3. Click "Logs" tab

## Backup and Data Management

### Export Data

Before major changes, export your data:

1. **Export participants**:
   - Go to `/participants` in production
   - Use export functionality

2. **Export winners**:
   - Go to `/winners` in production
   - Use export functionality

### Database Backups

Convex automatically backs up your data. To restore:
1. Contact Convex support
2. Or use Convex dashboard backup features

## Security Checklist

Before going live:
- [ ] Admin credentials are strong and secure
- [ ] Environment variables are not exposed in client code
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Authentication is working correctly
- [ ] No sensitive data in public pages
- [ ] Rate limiting is considered (if needed)

## Performance Optimization

### Next.js Optimizations

Already included:
- [x] Image optimization (Next.js Image component)
- [x] Code splitting
- [x] Static generation where possible

### Convex Optimizations

- [x] Efficient queries with indexes
- [x] Pagination for large datasets
- [x] Caching where appropriate

## Post-Deployment

### Share with Users

1. **Admin access**:
   - Share production URL with admins
   - Provide admin credentials securely

2. **Participant registration**:
   - Share `/register` URL with participants
   - Or display `/register-qr` on projector

3. **Documentation**:
   - Share user guides if needed
   - Provide support contact information

## Quick Reference

### Useful Commands

```bash
# Deploy Convex to production
npx convex deploy

# Open Convex dashboard
npx convex dashboard

# Deploy Next.js to Vercel
vercel --prod

# View Vercel logs
vercel logs

# Run Convex function in production
npx convex run functionName --prod
```

### Important URLs

- **Convex Dashboard**: https://dashboard.convex.dev
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Production App**: https://your-app.vercel.app
- **Your Convex Backend**: https://your-project.convex.cloud

## Support

If you encounter issues:

1. **Convex Support**:
   - Discord: https://convex.dev/community
   - Docs: https://docs.convex.dev

2. **Vercel Support**:
   - Discord: https://vercel.com/discord
   - Docs: https://vercel.com/docs

3. **Next.js Support**:
   - Discord: https://nextjs.org/discord
   - Docs: https://nextjs.org/docs

---

**Deployment Date**: _____________
**Production URL**: _____________
**Convex URL**: _____________
**Deployed By**: _____________

