# Twilio WhatsApp Image Download - 401 Error Fix Guide

## Problem
Error: `Could not download image. Error: 401`
Twilio Error Code: **20003 - Authentication Failed**

## Root Cause
Your Twilio Auth Token is **invalid or expired**. This happens when:
1. Auth Token was reset/regenerated in Twilio Console
2. New credentials were created but not updated in `.env`
3. Account credentials don't match

## Solution Steps

### Step 1: Get Your Current Twilio Credentials

1. Go to **Twilio Console**: https://console.twilio.com/
2. Log in to your account
3. Navigate to **Account Dashboard**
4. Find your **Account SID** and **Auth Token** in the "Account Info" section
5. If your Auth Token is hidden, click **"Show"** or **"Reset"** to get a new one

⚠️ **IMPORTANT**: If you reset your Auth Token, the old one becomes invalid immediately!

### Step 2: Update Your `.env` File

1. Open: `c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\.env`
2. Update these lines with your NEW credentials:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Restart Your Flask Server

After updating `.env`, you MUST restart the server:

1. Stop the current server (Ctrl+C in the terminal)
2. Run: `python app.py`

The server will reload environment variables on startup.

### Step 4: Test Again

Send a prescription image via WhatsApp and it should now download successfully!

---

## Additional Notes

### WhatsApp Sandbox Number
Make sure you're sending messages to the correct Twilio WhatsApp number.
You can find your sandbox number at: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

### Verify Credentials Script
Run this script to test your credentials before using the webhook:

```bash
python test_twilio_auth.py
```

### Check Environment Variables
If unsure which credentials are being loaded, add this to your app.py temporarily:

```python
print(f"Using Account SID: {os.environ.get('TWILIO_ACCOUNT_SID')}")
print(f"Auth Token exists: {bool(os.environ.get('TWILIO_AUTH_TOKEN'))}")
```

---

## What Was Fixed in Code

The code has been updated to:
1. ✅ Always require Twilio credentials (no fallback)
2. ✅ Use proper Basic Auth for all media downloads
3. ✅ Better error logging for debugging
4. ✅ Increased timeout to 15 seconds for downloads

---

## Quick Checklist

- [ ] Got new Auth Token from Twilio Console
- [ ] Updated `.env` file with new credentials  
- [ ] Restarted Flask server (python app.py)
- [ ] Tested with test_twilio_auth.py script
- [ ] Sent test image via WhatsApp

---

## Still Having Issues?

1. Check `ocr_debug.log` for detailed error messages
2. Verify your Twilio account is active and not suspended
3. Ensure you're using the WhatsApp Sandbox correctly
4. Make sure you've joined the sandbox by sending the join code first
