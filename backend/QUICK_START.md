# 🚀 Quick Start Guide - Real Email Setup

## What You Need

Before starting, make sure you have:
- ✅ Node.js installed on your computer
- ✅ A SendGrid account (free tier)
- ✅ 15-20 minutes

---

## Step 1: Install Node.js

1. Go to https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer
4. Verify installation by opening PowerShell and typing:
   ```powershell
   node --version
   npm --version
   ```

---

## Step 2: Create SendGrid Account

1. Go to https://signup.sendgrid.com/
2. Sign up with your email
3. Verify your email address
4. Complete the "Tell us about yourself" form
5. Skip the "Send your first email" tutorial for now

---

## Step 3: Get SendGrid API Key

1. In SendGrid dashboard, click **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it: `Tech-Lead-OTP`
4. Select **Full Access**
5. Click **Create & View**
6. **COPY THE API KEY** (you'll only see it once!)
   - It looks like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Step 4: Verify Sender Email

1. In SendGrid, go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in the form:
   - **From Name:** SLT Tech-Lead Platform
   - **From Email Address:** Your actual email (e.g., nikiltab1@gmail.com)
   - **Reply To:** Same as above
   - Fill in other required fields
4. Click **Create**
5. Check your email inbox
6. Click the verification link
7. **Copy your verified email address**

---

## Step 5: Install Backend Dependencies

1. Open PowerShell
2. Navigate to the backend folder:
   ```powershell
   cd "f:\techlead\final tech lead app\demo-tech-lead-app-2\backend"
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
   
   This will install:
   - express
   - @sendgrid/mail
   - dotenv
   - cors
   - body-parser

---

## Step 6: Configure Environment Variables

1. In the backend folder, copy the example file:
   ```powershell
   copy .env.example .env
   ```

2. Open `.env` file in Notepad or VS Code

3. Replace the values with your actual credentials:
   ```
   SENDGRID_API_KEY=SG.your_actual_api_key_from_step_3
   FROM_EMAIL=your-verified-email@example.com
   PORT=3000
   ```

4. Save the file

---

## Step 7: Start the Backend Server

1. In PowerShell (in the backend folder):
   ```powershell
   npm start
   ```

2. You should see:
   ```
   ==================================================
   🚀 Backend Server Started Successfully!
   ==================================================
   📡 Server running on: http://localhost:3000
   📧 Email service: SendGrid
   ✉️  From email: your-email@example.com
   ==================================================
   ```

3. **Keep this window open!** The server needs to stay running.

---

## Step 8: Test the Email System

1. Open a **new PowerShell window**

2. Test the backend:
   ```powershell
   curl -X POST http://localhost:3000/api/send-otp `
     -H "Content-Type: application/json" `
     -d '{\"email\":\"your-email@example.com\",\"otp\":\"123456\"}'
   ```

3. Check your email inbox - you should receive an OTP email!

---

## Step 9: Use with Your App

1. Make sure the backend server is still running
2. Open Chrome
3. Go to: `file:///f:/techlead/final tech lead app/demo-tech-lead-app-2/admin-dashboard.html`
4. Login as a user (e.g., nikil1/nikil1)
5. Go to **Profile** → **Edit Profile**
6. Change your password
7. **Check your email inbox** for the OTP code
8. Enter the code in the modal
9. Click **Verify**
10. Password changed! ✅

---

## What Happens Now?

### When Backend is Running:
- ✅ Real emails sent to your inbox
- ✅ No demo display shown
- ✅ Professional email template
- ✅ Notification: "OTP sent to your email"

### When Backend is Offline:
- ⚠️ Automatic fallback to demo mode
- ⚠️ OTP displayed in modal
- ⚠️ Notification: "Backend offline - using demo mode"

---

## Troubleshooting

### "Cannot find module 'express'"
**Fix:** Run `npm install` in the backend folder

### "Unauthorized" error from SendGrid
**Fix:** Check your API key in `.env` file - make sure it's correct

### "From email does not match verified sender"
**Fix:** Make sure you verified your email in SendGrid and used the exact same email in `.env`

### Frontend still shows demo mode
**Fix:** Make sure backend server is running on http://localhost:3000

### Port 3000 already in use
**Fix:** Edit `.env` and change `PORT=3000` to `PORT=3001`

---

## Daily Usage

### Starting the System:
1. Open PowerShell
2. `cd "f:\techlead\final tech lead app\demo-tech-lead-app-2\backend"`
3. `npm start`
4. Open your app in Chrome

### Stopping the Server:
- Press `Ctrl + C` in the PowerShell window

---

## Important Notes

🔒 **Security:**
- Never share your `.env` file
- Never commit `.env` to Git
- Keep your API key secret

💰 **Free Tier Limits:**
- 100 emails per day
- Perfect for testing and demos

📧 **Email Delivery:**
- Emails usually arrive within seconds
- Check spam folder if not received
- Verify sender email is correct

---

## Need Help?

1. Check the server console for error messages
2. Check SendGrid dashboard → Activity
3. Verify your API key and sender email
4. See the full README.md in the backend folder

---

## Success! 🎉

You now have a fully functional email system that sends real OTP codes to your inbox!
