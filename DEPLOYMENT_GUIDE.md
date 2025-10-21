# CalculateThis.org - Replit Deployment Guide

## Pre-Deployment Checklist

Before you deploy, make sure these are set up:

### ✅ 1. Database (Already Done)
- Your PostgreSQL database is already configured
- Environment variables (`DATABASE_URL`, etc.) are already set
- All migrations have been applied

### ✅ 2. Session Secret
- You already have `SESSION_SECRET` configured
- This keeps user sessions secure

### ✅ 3. Test Your App Locally
- Make sure the app runs without errors in development
- Test login/registration works
- Test a few calculators
- Test the admin dashboard

---

## Step-by-Step Deployment Instructions

### Step 1: Access the Publish Button

1. Look at the **top of your Replit workspace**
2. Click the **"Deploy"** or **"Publish"** button in the header

### Step 2: Choose Deployment Type

1. Select **"Autoscale"** deployment option
2. This is the most cost-effective for your calculator site

### Step 3: Configure Deployment Settings

**Machine Configuration** (defaults are fine):
- 1 vCPU
- 2 GiB RAM
- Maximum 3 machines

**Run Command:**
Your app should use: `npm run dev` (for development) or `npm start` (for production)

**Important:** Make sure your app binds to `0.0.0.0:5000` (it already does!)

### Step 4: Verify Environment Variables

Your deployment will automatically include:
- ✅ `DATABASE_URL` - PostgreSQL connection
- ✅ `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`
- ✅ `SESSION_SECRET` - Session encryption key

**If you need to add more later:**
- Go to Secrets tool in workspace
- Add new secret
- Redeploy for changes to take effect

### Step 5: Launch Your Deployment

1. Click **"Publish"** button
2. Wait 2-3 minutes for deployment
3. Your app will be live at: `https://your-app-name.replit.app`

---

## Post-Deployment Verification

### 1. Test Your Live Site

Visit your deployment URL and test:
- [ ] Homepage loads correctly
- [ ] Registration works (create a test account)
- [ ] Login works
- [ ] Try a calculator (e.g., BMI Calculator)
- [ ] Admin dashboard loads (login as nethania@gmail.com)
- [ ] Calculator history saves for logged-in users

### 2. Check the Console

In Replit workspace:
1. Go to **"Console"** tool
2. Look for any errors in your deployed app
3. Common issues:
   - Port binding errors (should be 0.0.0.0, not localhost)
   - Database connection errors
   - Missing environment variables

### 3. Monitor Performance

In the deployment dashboard:
- Check response times
- Monitor resource usage
- Review costs (should be minimal with low traffic)

---

## Custom Domain Setup (Optional)

If you want to use **calculatethis.org** instead of *.replit.app:

### Option A: Point Your Hostinger Domain to Replit

1. **In Replit Deployment Dashboard:**
   - Click on your deployment
   - Go to "Domains" section
   - Click "Add custom domain"
   - Enter: `calculatethis.org`
   - Replit will show you DNS records to add

2. **In Hostinger DNS Settings:**
   - Login to Hostinger
   - Go to your domain management
   - Add the DNS records Replit provided:
     - Type: `CNAME`
     - Name: `@` or `www`
     - Value: (provided by Replit)
   - Save changes

3. **Wait for DNS Propagation:**
   - Can take 1-48 hours
   - Your site will be accessible at calculatethis.org

### Option B: Keep Using Replit Subdomain

- Your app is live at: `your-app-name.replit.app`
- Free, works immediately
- No DNS configuration needed

---

## Cost Breakdown (Autoscale Deployment)

### Monthly Costs:
- **Base fee:** $1.00/month
- **Compute units:** $3.20 per million units
- **Requests:** $1.20 per million requests

### Example for Low Traffic Site:
- 10,000 visits/month
- Average 2 calculators per visit
- **Estimated cost:** ~$2-3/month total

### If You Have Replit Core ($20/mo):
- You get $25 in monthly credits
- Your deployment is likely **covered by credits**
- Effectively **FREE** or near-free!

---

## Troubleshooting

### App Won't Start
**Problem:** Deployment fails or app crashes
**Solution:**
1. Check Console for error messages
2. Verify `PORT` environment variable is used correctly
3. Make sure app binds to `0.0.0.0`, not `localhost`

### Database Connection Failed
**Problem:** Can't connect to PostgreSQL
**Solution:**
1. Verify `DATABASE_URL` is in deployment secrets
2. Check database is accessible from deployment
3. Test connection in development first

### Sessions Not Persisting
**Problem:** Users get logged out frequently
**Solution:**
1. Verify `SESSION_SECRET` is set
2. Check session store is configured correctly
3. Make sure cookies work over HTTPS

### Admin Dashboard Not Loading
**Problem:** 403 or 404 errors
**Solution:**
1. Verify your email (nethania@gmail.com) is in admin_users table
2. Check authentication middleware is working
3. Clear browser cookies and try again

---

## Updating Your Deployed App

When you make changes to your code:

1. **Test locally first** in development workspace
2. **Click "Redeploy"** in the deployment dashboard
3. **Wait 2-3 minutes** for new version to go live
4. **Test the live site** to verify changes

**Note:** Deployments automatically pull from your latest code!

---

## Production Best Practices

### Security
- ✅ Never log sensitive data in production
- ✅ Use strong `SESSION_SECRET` (you already have this)
- ✅ Keep dependencies updated
- ✅ Monitor for unusual activity

### Performance
- Monitor response times in deployment dashboard
- Optimize slow calculators if needed
- Consider caching frequently used data
- Use Autoscale to handle traffic spikes

### Backups
- Your PostgreSQL database should be backed up regularly
- Replit provides automatic backups for databases
- You can export data manually via admin dashboard

---

## Support Resources

### Replit Documentation
- Deployment docs: https://docs.replit.com/
- Community forum: https://ask.replit.com/

### Your App Details
- **Admin Email:** nethania@gmail.com
- **Temp Password:** TempPass2024! (change this after first login!)
- **Database:** PostgreSQL (Neon-backed)
- **Framework:** Node.js + Express + React

---

## Ready to Deploy?

**Your app is production-ready!** Here's what to do:

1. ✅ Test your app one more time locally
2. ✅ Click the "Deploy" button at the top
3. ✅ Choose "Autoscale" deployment
4. ✅ Click "Publish"
5. ✅ Wait 2-3 minutes
6. ✅ Visit your live URL and test!

**Estimated deployment cost:** ~$1-3/month (or FREE with Core plan credits!)

Good luck with your launch! 🚀
