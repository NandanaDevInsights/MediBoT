# How to Remove "Test Mode" Badge from Razorpay

## ⚠️ IMPORTANT: This Will Process REAL Money

Once you switch to live mode, **actual payments will be processed**. Make sure you've tested everything thoroughly first!

## Step-by-Step Instructions

### 1. Complete KYC Verification (Required for Live Mode)

Before you can use live mode, Razorpay requires you to complete KYC:

1. Go to https://dashboard.razorpay.com/
2. Navigate to **Settings** → **Account Details**
3. Complete your business KYC:
   - Business name and details
   - Bank account information
   - Business documents (PAN, GST if applicable)
   - Owner's identity proof
4. Wait for verification (usually 24-48 hours)

### 2. Generate Live API Keys

Once KYC is approved:

1. Log in to https://dashboard.razorpay.com/
2. **Toggle from "Test Mode" to "Live Mode"** (top-left corner)
3. Go to **Settings** → **API Keys**
4. Click **Generate Live Keys**
5. Copy both:
   - Key ID (starts with `rzp_live_`)
   - Key Secret

### 3. Update Your .env File

Open: `c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\.env`

Replace lines 54-55 with your live credentials:

```env
# Production Mode: LIVE (processes REAL money, NO "Test Mode" badge)
RAZORPAY_KEY_ID=rzp_live_YOUR_ACTUAL_LIVE_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_LIVE_SECRET_HERE
```

### 4. Restart Your Backend Server

The backend must be restarted to load the new credentials:

1. Stop the Flask server (Ctrl+C in terminal)
2. Start it again: `python app.py`

### 5. Test with Small Amount

Before going fully live:

1. Make a test booking with a **very small amount** (₹1 or ₹10)
2. Use a real payment method
3. Verify the payment goes through
4. Check that it appears correctly in your Razorpay dashboard
5. Confirm the booking is saved in your database

## ✅ Once Live Mode is Active

- ✅ The "Test Mode" badge will **disappear automatically**
- ✅ Real payments will be processed
- ✅ Money will be deposited to your registered bank account
- ✅ You'll receive Razorpay's standard fees (2% + GST)

## 🔒 Security Reminders

- **NEVER** commit live credentials to GitHub
- **NEVER** share your Key Secret with anyone
- Keep your `.env` file secure
- Add `.env` to your `.gitignore` file

## Alternative: Stay in Test Mode

If you're not ready to accept real payments yet:

- Keep using test credentials
- The "Test Mode" badge will remain (this is normal and expected)
- You can test all functionality without processing real money
- Use Razorpay's test card numbers: https://razorpay.com/docs/payments/payments/test-card-upi-details/

---

**Bottom Line:** The badge is Razorpay's safety feature. The only way to remove it is to use live credentials, which means processing real money. There is no code workaround.
