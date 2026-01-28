# SendGrid Setup - Step-by-Step Guide

## 🎯 What We're Doing

Setting up SendGrid so your app can send **real OTP emails** to your inbox!

---

## ✅ Step 1: Create SendGrid Account

I'll open the signup page for you. Please:

1. **Sign up** at https://signup.sendgrid.com/
2. Fill in your details:
   - Email address (use your real email)
   - Password
   - Company name (you can use "Tech Lead Demo" or anything)
3. Click **Create Account**
4. **Check your email** and verify your account
5. Complete the "Tell us about yourself" form

**⏸️ STOP HERE and let me know when you've completed this step!**

---

## 📧 Step 2: Verify Your Sender Email

Once logged into SendGrid:

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in the form:
   - **From Name:** SLT Tech-Lead Platform
   - **From Email Address:** YOUR ACTUAL EMAIL (e.g., nikiltab1@gmail.com)
   - **Reply To:** Same as above
   - **Company Address:** Any address
   - **City, State, Zip:** Any valid info
   - **Country:** Sri Lanka (or your country)
4. Click **Create**
5. **Check your email inbox**
6. Click the verification link
7. **Copy your verified email address** (you'll need it in Step 3)

**⏸️ STOP HERE and let me know when you've verified your email!**

---

## 🔑 Step 3: Get Your API Key

In SendGrid dashboard:

1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it: `Tech-Lead-OTP`
4. Select **Full Access**
5. Click **Create & View**
6. **COPY THE API KEY** (you'll only see it once!)
   - It looks like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**⏸️ STOP HERE and paste your API key when ready!**

---

## ⚙️ Step 4: Configure Backend (I'll Do This)

Once you give me:
- ✅ Your SendGrid API key
- ✅ Your verified sender email

I will:
1. Create the `.env` file
2. Add your credentials
3. Start the backend server
4. Test that emails are working

---

## 🧪 Step 5: Test Real Emails

We'll test by:
1. Changing your password in the app
2. Checking your email inbox for the OTP
3. Verifying it works!

---

## 📝 Current Progress

- [x] Node.js installed
- [x] Backend dependencies installed
- [ ] SendGrid account created
- [ ] Sender email verified
- [ ] API key obtained
- [ ] Backend configured
- [ ] Server started
- [ ] Real email tested

---

## 🆘 Need Help?

If you get stuck at any step, just let me know and I'll help you through it!

**Ready? Let's start with Step 1 - I'll open the SendGrid signup page for you now!**
