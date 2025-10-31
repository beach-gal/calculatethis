# CalculateThis.org - Site Transfer Guide

## 📋 Overview

This guide will help you (the new owner) successfully take over CalculateThis.org. The site includes 200+ calculators, AI-powered custom calculator builder, admin dashboard, and advertising integration.

**Current Tech Stack:**
- Frontend: React + TypeScript + Vite
- Backend: Express.js + Node.js
- Database: PostgreSQL (Neon via Replit)
- Hosting: Replit Autoscale Deployment
- Domain: calculatethis.org

---

## 🔄 Transfer Process

### Phase 1: Replit Transfer (Done by Previous Owner)

The previous owner will transfer the Repl to your Replit account or organization:

1. **You must have a Replit account** - Sign up at https://replit.com if needed
2. **Previous owner initiates transfer** - They'll use Replit's "Transfer to Organization" feature
3. **You accept the transfer** - You'll receive a notification
4. **Database transfers automatically** - All user data, calculators, and settings remain intact

### Phase 2: Account Setups (Your Responsibility)

You need to create accounts with these services and update the credentials:

#### 1️⃣ **Google AdSense** (Revenue Stream - CRITICAL)

**Why:** This is how the site generates revenue from ads.

**Setup Steps:**
1. Create Google AdSense account at https://adsense.google.com
2. Add `calculatethis.org` as your site
3. Wait for AdSense approval (usually 24-48 hours)
4. Get your Publisher ID (format: `ca-pub-XXXXXXXXXXXXX`)

**Update in Code:**
- File: `client/index.html`
- Line 24: Replace `ca-pub-5655767143085411` with YOUR publisher ID
- Example:
  ```html
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ID-HERE"
  ```

**Important:** Until you update this, ad revenue goes to the previous owner!

---

#### 2️⃣ **Resend** (Email Service for Password Resets)

**Why:** Sends password reset emails to users.

**Setup Steps:**
1. Create account at https://resend.com
2. Verify your domain `calculatethis.org` at https://resend.com/domains
   - Add DNS records they provide (TXT, MX, or CNAME)
   - Wait for verification (usually instant to 1 hour)
3. Create an API key in Resend dashboard
4. Note: Without domain verification, emails only work to your Resend account email

**Update in Replit:**
1. Open your Replit project
2. Go to "Secrets" or "Environment Variables"
3. Find or create `RESEND_API_KEY`
4. Paste your new API key

**Test:** Try the "Forgot Password" flow on your site after setup

---

#### 3️⃣ **OpenAI API** (Optional - AI Calculator Builder)

**Why:** Powers the custom calculator creation feature.

**Setup Steps:**
1. Create account at https://platform.openai.com
2. Add billing information (pay-as-you-go, ~$0.01 per calculator generated)
3. Generate API key at https://platform.openai.com/api-keys

**Update in Replit:**
1. Go to "Secrets" or "Environment Variables"
2. Find or create `OPENAI_API_KEY`
3. Paste your new API key

**Note:** If you don't set this up, the AI calculator builder won't work, but all 200+ built-in calculators will work fine.

---

#### 4️⃣ **Google OAuth** (Currently Not Used - Optional)

**Status:** The site currently uses email/password authentication. Google OAuth credentials exist but aren't actively used.

**If you want to keep it:**
- Keep the existing `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` secrets
- Or create new OAuth credentials at https://console.cloud.google.com

**If you don't need it:**
- You can safely ignore or delete these secrets

---

### Phase 3: Admin Access

#### Become Site Administrator

1. **Create your account** on the live site:
   - Go to https://calculatethis.org/register
   - Sign up with your email

2. **Make yourself admin:**
   - Go to https://calculatethis.org/admin-setup
   - Click "Make Me Admin"
   - You'll be redirected to the admin dashboard

3. **Verify admin access:**
   - Go to https://calculatethis.org/admin
   - You should see the admin dashboard with 4 tabs:
     - Ad Codes
     - Administrators  
     - Community Calculators
     - Settings

4. **Remove previous owner (optional):**
   - Go to "Administrators" tab
   - Find previous owner's email
   - Click the trash icon to remove them

---

### Phase 4: Update & Publish

#### Update the Code

After setting up all services above:

1. **Update AdSense ID** in `client/index.html` (line 24)
2. **Update Resend API key** in Replit Secrets
3. **Update OpenAI API key** in Replit Secrets (if using)

#### Publish Changes

1. **In Replit:** Click the "Deploy" or "Publish" button
2. **Wait for build:** Usually takes 1-3 minutes
3. **Verify live site:** Visit https://calculatethis.org

---

## ✅ Post-Transfer Checklist

### Verify Everything Works:

- [ ] **Homepage loads** at https://calculatethis.org
- [ ] **Calculators work** - Test a few (e.g., /calculator/percentage)
- [ ] **User registration works** - Try creating a test account
- [ ] **Login works** - Sign in with test account
- [ ] **Password reset emails work** - Use "Forgot Password" feature
- [ ] **Admin dashboard accessible** at /admin
- [ ] **AI calculator builder works** at /custom-calculator (if OpenAI set up)
- [ ] **AdSense ads appear** (may take 24-48 hours after approval)
- [ ] **Community calculators section appears** on homepage

### Admin Dashboard Features:

- [ ] **Ad Codes tab** - Can add/edit/activate ad codes (if needed)
- [ ] **Administrators tab** - Can add/remove admins
- [ ] **Community Calculators tab** - Can feature/unfeature user-created calculators
- [ ] **Settings tab** - Can update contact email and toggle ads globally

### Revenue Verification:

- [ ] **AdSense dashboard** shows calculatethis.org
- [ ] **Ads are serving** on your live site
- [ ] **Revenue is tracking** to YOUR AdSense account (not previous owner's)

---

## 🗂️ What You're Getting

### Site Features:
- ✅ 200+ pre-built calculators across 4 categories (Math, Finance, Health, Other)
- ✅ AI-powered custom calculator builder (users can create calculators with AI)
- ✅ User authentication system (email/password)
- ✅ Calculation history tracking (for logged-in users)
- ✅ Admin dashboard for site management
- ✅ Community calculators showcase system
- ✅ Google AdSense integration
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ SEO optimized with sitemap.xml
- ✅ Dark mode support

### Database Includes:
- All user accounts and passwords (encrypted)
- Calculator usage history
- Custom user-created calculators
- Featured calculator settings
- Admin user list
- Ad code configurations
- Site settings

### Domain:
- **calculatethis.org** - DNS points to Replit deployment
- No action needed unless you want to transfer domain registrar

---

## 🆘 Troubleshooting

### Problem: Can't access /admin

**Solution:**
1. Make sure you're logged in
2. Go to /admin-setup and click "Make Me Admin"
3. If it says "Admins already exist", the previous owner needs to add you first

### Problem: Password reset emails not working

**Solution:**
1. Verify your domain in Resend at https://resend.com/domains
2. Check DNS records are properly configured
3. Test by sending to the email associated with your Resend account first

### Problem: AdSense not showing ads

**Reasons:**
1. AdSense account not yet approved (wait 24-48 hours)
2. Publisher ID not updated in `client/index.html`
3. Site not yet published after updating publisher ID
4. Ad blocker enabled in your browser (disable to test)

### Problem: AI calculator builder not working

**Solution:**
1. Check OpenAI API key is set in Replit Secrets
2. Verify billing is set up in OpenAI account
3. Check browser console for errors (F12 > Console tab)

### Problem: Site is down or not loading

**Solution:**
1. Check Replit deployment status in Replit dashboard
2. Verify domain DNS is pointing to Replit
3. Check "Deployments" tab in Replit for errors

---

## 💰 Ongoing Costs

### Required:
- **Replit Autoscale Deployment**: ~$1-3/month (scales with traffic)
- **Domain Registration**: ~$10-15/year (at your domain registrar)

### Optional:
- **OpenAI API**: Pay-as-you-go (~$0.01 per AI calculator generated)
- **Resend Email**: Free tier (up to 3,000 emails/month), then pay-as-you-go

### Revenue:
- **Google AdSense**: Variable, depends on traffic and ad engagement

---

## 📞 Support Resources

### Documentation:
- Replit Docs: https://docs.replit.com
- Resend Docs: https://resend.com/docs
- OpenAI Docs: https://platform.openai.com/docs
- AdSense Help: https://support.google.com/adsense

### Site-Specific:
- **Admin Dashboard**: https://calculatethis.org/admin
- **Sitemap**: https://calculatethis.org/sitemap.xml
- **Community Calculators**: https://calculatethis.org/community-calculators

---

## 🎯 Quick Start Summary

1. ✅ Accept Replit transfer from previous owner
2. ✅ Create AdSense account & get publisher ID
3. ✅ Update `client/index.html` with YOUR AdSense ID
4. ✅ Create Resend account & verify domain
5. ✅ Update Resend API key in Replit Secrets
6. ✅ (Optional) Set up OpenAI API key for AI features
7. ✅ Publish changes in Replit
8. ✅ Register account on live site
9. ✅ Go to /admin-setup to become admin
10. ✅ Test everything using checklist above

**Estimated setup time:** 2-4 hours (mostly waiting for AdSense approval and domain verification)

---

## 📝 Notes

- **Database is already populated** with 5 sample featured calculators (you can manage these in admin dashboard)
- **All 200+ calculators work immediately** - no setup needed
- **Users can create accounts** and start using the site right away
- **Custom domain** (calculatethis.org) is already configured and working

---

Good luck with your new site! If you run into issues during transfer, refer to the troubleshooting section above.

**Last Updated:** October 2025
