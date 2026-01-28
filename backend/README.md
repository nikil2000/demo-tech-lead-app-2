# Backend Server - Setup Guide

## Overview
This backend server sends real OTP emails using SendGrid for the SLT Tech-Lead Platform.

---

## Prerequisites

1. **Node.js** - Download from https://nodejs.org/ (LTS version recommended)
2. **SendGrid Account** - Free tier available at https://signup.sendgrid.com/

---

## Setup Instructions

### Step 1: Install Node.js
1. Download Node.js from https://nodejs.org/
2. Install the LTS version
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Create SendGrid Account
1. Go to https://signup.sendgrid.com/
2. Sign up for a free account
3. Verify your email address
4. Complete the setup wizard

### Step 3: Get SendGrid API Key
1. Login to SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it (e.g., "Tech-Lead-OTP")
5. Select **Full Access** permissions
6. Click **Create & View**
7. **Copy the API key** (you'll only see it once!)

### Step 4: Verify Sender Email
1. In SendGrid, go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details (use your actual email)
4. Check your email and click the verification link
5. Copy the verified email address

### Step 5: Configure Backend
1. Open terminal in the backend folder:
   ```bash
   cd "f:/techlead/final tech lead app/demo-tech-lead-app-2/backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   copy .env.example .env
   ```

4. Edit `.env` file and add your credentials:
   ```
   SENDGRID_API_KEY=SG.your_actual_api_key_here
   FROM_EMAIL=your-verified-email@example.com
   PORT=3000
   ```

### Step 6: Start the Server
```bash
npm start
```

You should see:
```
🚀 Backend Server Started Successfully!
📡 Server running on: http://localhost:3000
```

---

## Testing the Server

### Test 1: Health Check
Open browser and visit:
```
http://localhost:3000/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Backend server is running"
}
```

### Test 2: Send Test Email
Use PowerShell or Command Prompt:
```powershell
curl -X POST http://localhost:3000/api/send-otp `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"your-email@example.com\",\"otp\":\"123456\"}'
```

Check your email inbox for the OTP email!

---

## Using with Frontend

1. **Start the backend server** (keep it running):
   ```bash
   npm start
   ```

2. **Open the frontend** in Chrome:
   ```
   file:///f:/techlead/final tech lead app/demo-tech-lead-app-2/admin-dashboard.html
   ```

3. **Test password change:**
   - Login as a user
   - Go to Profile → Edit Profile
   - Change password
   - Check your email for the OTP code
   - Enter the code and verify

---

## Troubleshooting

### Error: "Cannot find module 'express'"
**Solution:** Run `npm install` in the backend folder

### Error: "Unauthorized" from SendGrid
**Solution:** Check your API key in `.env` file

### Error: "The from email does not match a verified Sender Identity"
**Solution:** Verify your sender email in SendGrid settings

### Frontend shows "Backend offline - using demo mode"
**Solution:** Make sure the backend server is running on `http://localhost:3000`

### Port 3000 already in use
**Solution:** Change PORT in `.env` file to 3001 or another available port

---

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

---

## Important Notes

⚠️ **Never commit your `.env` file to Git** - It contains your API key!

✅ **Free tier limits:** 100 emails per day (perfect for testing)

🔒 **Keep your API key secret** - Don't share it with anyone

📧 **Sender email must be verified** - SendGrid requires this for security

---

## Support

If you encounter issues:
1. Check the server console logs for errors
2. Verify your SendGrid API key is correct
3. Ensure your sender email is verified
4. Check SendGrid dashboard for email activity

For SendGrid help: https://docs.sendgrid.com/
