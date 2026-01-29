# WhatsApp Webhook Setup Guide - Complete Fix

## Problem
You're not receiving WhatsApp messages and no logs appear in the terminal because:
- ❌ Your Flask server is running locally (localhost:5000)
- ❌ Twilio can't reach localhost from the internet
- ❌ Webhook is never triggered

## Solution: Expose Your Local Server

You need to expose your local server to the internet so Twilio can send webhooks to it.

---

## Option 1: Using ngrok (Recommended for Testing)

### Step 1: Install ngrok

**Method A - Download:**
1. Go to: https://ngrok.com/download
2. Download ngrok for Windows
3. Extract the file to a folder (e.g., `C:\ngrok\`)

**Method B - Using Chocolatey (if you have it):**
```powershell
choco install ngrok
```

### Step 2: Sign Up (Optional but Recommended)
1. Create a free account at: https://dashboard.ngrok.com/signup
2. Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken
3. Run: `ngrok authtoken YOUR_AUTH_TOKEN`

### Step 3: Start ngrok Tunnel

Open a NEW terminal (keep your Flask server running) and run:

```powershell
ngrok http 5000
```

You'll see output like:
```
Forwarding   https://1234-abcd-efgh.ngrok-free.app -> http://localhost:5000
```

**Copy that HTTPS URL!** (e.g., `https://1234-abcd-efgh.ngrok-free.app`)

### Step 4: Configure Twilio Webhook

1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Scroll to **"Sandbox Configuration"**
3. Find **"When a message comes in"** field
4. Enter: `https://YOUR-NGROK-URL/webhook/whatsapp`
   - Example: `https://1234-abcd-efgh.ngrok-free.app/webhook/whatsapp`
5. Make sure method is **POST**
6. Click **Save**

### Step 5: Test!

1. Send a prescription image via WhatsApp
2. Watch your Flask terminal - you should see:
   ```
   [INFO] Webhook HIT - Processing Prescription
   [DEBUG] Attempting download with Account SID: AC87e1526e...
   [DEBUG] Download response status: 200
   [INFO] Image downloaded: ...
   ```
3. You'll receive a reply message on WhatsApp!

---

## Option 2: Using Twilio's WhatsApp Sandbox (Alternative Testing)

### Step 1: Join Sandbox
1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Send the join code to the Twilio sandbox number from your WhatsApp
   - Example: Send "join <code>" to +1 415 523 8886

### Step 2: Configure Webhook (Same as above)
Follow Step 4 from Option 1

---

## Option 3: Deploy to a Public Server (Production)

For production use, deploy your Flask app to:
- **Heroku** (free tier available)
- **Railway** (free tier)
- **DigitalOcean** / **AWS** / **Azure**
- **Render** (free tier)

Then use your public URL in Twilio webhook settings.

---

## Quick Setup Script

I'll create an automated script to help you:

### 1. First, run this to check if everything else is ready:

```powershell
python validate_whatsapp_setup.py
```

### 2. Start your setup:

**Terminal 1 (Flask Server):**
```powershell
python app.py
```

**Terminal 2 (ngrok - if using):**
```powershell
ngrok http 5000
```

**Terminal 3 (Optional - Monitor logs):**
```powershell
Get-Content ocr_debug.log -Wait
```

---

## Troubleshooting

### "Still no logs in terminal"
- ✅ Check ngrok is running (`ngrok http 5000`)
- ✅ Verify Twilio webhook URL includes your ngrok URL
- ✅ Make sure webhook URL ends with `/webhook/whatsapp`
- ✅ Verify webhook method is POST
- ✅ Check if you've joined the WhatsApp sandbox

### "401 Error still appears"
- ✅ Update Twilio credentials in `.env`
- ✅ Restart Flask server after updating `.env`
- ✅ Run `python test_twilio_auth.py` to verify credentials

### "Can't download ngrok / Don't want to use ngrok"
Alternative tunneling services:
- **localtunnel**: `npx localtunnel --port 5000`
- **cloudflared**: Cloudflare's free tunnel
- **serveo**: `ssh -R 80:localhost:5000 serveo.net`

---

## Testing Checklist

Before sending a test image, verify:

- [ ] Flask server is running (`python app.py`)
- [ ] ngrok tunnel is active (or using alternative)
- [ ] Twilio webhook URL is configured with your public URL
- [ ] You've joined the WhatsApp sandbox (sent join code)
- [ ] Twilio credentials are updated in `.env`
- [ ] Database is running and accessible

---

## Expected Flow (When Working Correctly)

1. **You send image** via WhatsApp
2. **Twilio receives** the message
3. **Twilio calls** your webhook URL (via ngrok)
4. **Your terminal shows**:
   ```
   [INFO] Webhook HIT - Processing Prescription
   [DEBUG] Attempting download with Account SID: AC87e1526e...
   [DEBUG] Media URL: https://api.twilio.com/...
   [DEBUG] Download response status: 200
   [INFO] Image downloaded: static/prescriptions/rx_...
   ```
5. **OCR processes** the image
6. **Database saves** the prescription
7. **WhatsApp sends** reply message with results

---

## Quick Start Commands

```powershell
# Terminal 1 - Start Flask
cd "c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend"
python app.py

# Terminal 2 - Start ngrok (in a new terminal)
ngrok http 5000

# Then configure Twilio webhook with the ngrok HTTPS URL
# Then send test image via WhatsApp
```

---

## Need Help?

Run the diagnostic script:
```powershell
python validate_whatsapp_setup.py
```

Check logs:
```powershell
type ocr_debug.log
```
