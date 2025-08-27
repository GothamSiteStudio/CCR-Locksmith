# Netlify Deployment Guide for CCR Locksmith Website

## Quick Deployment Steps:

### 1. Go to Netlify
- Visit: https://netlify.com
- Click "Sign up" (or "Log in" if you have an account)
- Choose "Sign up with GitHub" for easiest setup

### 2. Deploy from GitHub
- After logging in, click "Add new site" → "Import an existing project"
- Choose "Deploy with GitHub"
- Authorize Netlify to access your GitHub account
- Select your repository: `alphaLocks/CCR-Locksmith`
- Click "Deploy site"

### 3. Configure Form Notifications (Important!)
- After deployment, go to your site dashboard
- Navigate to "Forms" tab
- Click "Form notifications"
- Add your email: `carcommercialresidentiallocks@gmail.com`
- Choose notification type: "New form submission"

### 4. Set Custom Domain (Optional)
- In site settings, go to "Domain management"
- Add your custom domain if you have one
- Follow the DNS setup instructions

## What Happens After Deployment:

✅ **Your contact form will work immediately**
✅ **Form submissions will be sent to your email**
✅ **All submissions are stored in Netlify dashboard**
✅ **Built-in spam protection with reCAPTCHA**
✅ **Automatic HTTPS/SSL certificate**
✅ **Free hosting with excellent performance**

## Testing the Form:

1. Once deployed, visit your new Netlify URL
2. Go to the contact page
3. Fill out and submit the test form
4. Check your email for the notification
5. Check Netlify dashboard → Forms to see the submission

## Your Site Will Be Available At:
- Temporary URL: `https://[random-name].netlify.app`
- You can change this to a custom name in site settings

## Troubleshooting:

**If forms don't work:**
1. Make sure the form has `data-netlify="true"`
2. Ensure the hidden input `name="form-name"` matches the form name
3. Check Netlify dashboard → Forms for error messages

**Need Help?**
- Netlify has excellent documentation: https://docs.netlify.com
- Contact form specific guide: https://docs.netlify.com/forms/setup/
