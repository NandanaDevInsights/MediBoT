# ⚠️ IMMEDIATE FIX NEEDED - WhatsApp Webhook Not Working

## THE PROBLEM
Your Flask server is running on **localhost:5000**, but Twilio cannot reach it because:
- localhost is only accessible from your computer
- Twilio needs a PUBLIC URL to send webhooks
- That's why you see NO logs and receive NO messages

## THE SOLUTION (5 MINUTES)

### Step 1: Download ngrok (1 minute)

1. Go to: https://ngrok.com/download
2. Click "Download for Windows"
3. Extract the ZIP file to your Desktop

### Step 2: Run ngrok (30 seconds)

1. Open a **NEW PowerShell window** (keep your Flask server running!)
2. Navigate to where you extracted ngrok:
   ```powershell
   cd Desktop
   ```
3. Run this command:
   ```powershell
   .\ngrok.exe http 5000
   ```

You'll see something like this:
```
Session Status                online
Forwarding                    https://a1b2-c3d4-e5f6.ngrok-free.app -> http://localhost:5000
```

**COPY THE HTTPS URL!** 
Example: `https://a1b2-c3d4-e5f6.ngrok-free.app`

⚠️ **KEEP THIS WINDOW OPEN!** If you close it, Twilio won't work.

### Step 3: Update Twilio Webhook (2 minutes)

1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

2. Scroll down to **"Sandbox Configuration"** section

3. Find the field **"When a message comes in"**

4. Paste your ngrok URL + `/webhook/whatsapp`
   
   Example: `https://a1b2-c3d4-e5f6.ngrok-free.app/webhook/whatsapp`

5. Make sure **HTTP Method** is set to **POST**

6. Click **SAVE**

### Step 4: Update Twilio Credentials (1 minute)

Your Twilio credentials might be expired. Update them:

1. In Twilio Console, find **Account Info** (top left)
2. Copy your **Account SID** and **Auth Token**
3. Open your `.env` file
4. Update these lines:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
5. Save the file
6. **RESTART your Flask server** (Ctrl+C, then `python app.py`)

### Step 5: Test! (30 seconds)

1. Send a prescription image to your WhatsApp sandbox number
2. **Watch your Flask terminal** - you should now see:
   ```
   [INFO] Webhook HIT - Processing Prescription
   [DEBUG] Attempting download with Account SID: AC87e1526e...
   [DEBUG] Media URL: https://api.twilio.com/...
   [DEBUG] Download response status: 200
   [INFO] Image downloaded: static/prescriptions/rx_...
   ```
3. You'll get a reply on WhatsApp with the extracted text!

---

## EXAMPLE: What You Should See

### In ngrok window:
```
POST /webhook/whatsapp    200 OK
```

### In Flask terminal:
```
[INFO] Webhook HIT - Processing Prescription
[DEBUG] Attempting download with Account SID: AC87e1526e...
[DEBUG] Media URL: https://api.twilio.com/2010-04-01/Accounts/...
[DEBUG] Download response status: 200
[INFO] Image downloaded: static/prescriptions/rx_1737442234_a1b2c3d4.jpg
```

### On WhatsApp (reply message):
```
✅ Prescription Processed!
🔬 Identified Category: Blood Test

TESTS ORDERED:
CBC
Hemoglobin
Blood Sugar

💾 Saved to Records
Login here to view full report:
http://127.0.0.1:5173/login
```

---

## TROUBLESHOOTING

### "ngrok: command not found"
- You need to navigate to where you extracted ngrok:
  ```powershell
  cd Desktop
  .\ngrok.exe http 5000
  ```

### "Still no logs in terminal"
- ✅ Check ngrok is running (don't close the ngrok window!)
- ✅ Check Twilio webhook URL is correct (must include `/webhook/whatsapp`)
- ✅ Make sure you've joined the WhatsApp sandbox (send join code first)

### "401 Error in logs"
- ✅ Update Twilio credentials in `.env`
- ✅ Restart Flask server after updating

### "ngrok session expired"
- Free ngrok sessions expire after ~2 hours
- Just restart ngrok and update the Twilio webhook URL

---

## QUICK CHECKLIST

Before sending test image:

- [ ] Flask server is running (`python app.py`)
- [ ] ngrok is running (`.\ngrok.exe http 5000`)
- [ ] Copied ngrok HTTPS URL
- [ ] Updated Twilio webhook with ngrok URL + `/webhook/whatsapp`
- [ ] Updated Twilio credentials in `.env`
- [ ] Restarted Flask server
- [ ] Joined WhatsApp sandbox

---

## RUNNING TERMINALS

You should have **2 terminals open**:

**Terminal 1 - Flask Server:**
```powershell
cd "c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend"
python app.py
```

**Terminal 2 - ngrok:**
```powershell
cd Desktop  # or wherever you extracted ngrok
.\ngrok.exe http 5000
```

Keep both running while testing WhatsApp!
