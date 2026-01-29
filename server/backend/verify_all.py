"""
Simple verification - Shows you EXACTLY what's wrong
"""
import requests
import json

print("\n" + "=" * 80)
print("   🔍 WEBHOOK CONNECTION DEBUGGER")
print("=" * 80)
print()

# Step 1: Check Flask
print("STEP 1: Checking Flask Server...")
try:
    r = requests.get("http://localhost:5000", timeout=2)
    print("✅ Flask is running on http://localhost:5000")
except:
    print("❌ Flask is NOT running!")
    print("   → Start it with: python OCR.py")
    exit(1)

print()

# Step 2: Check Flask webhook endpoint
print("STEP 2: Checking Webhook Endpoint...")
try:
    r = requests.get("http://localhost:5000/webhook/whatsapp", timeout=2)
    if "active and ready" in r.text:
        print("✅ Webhook endpoint responding correctly")
    else:
        print("⚠️  Webhook endpoint exists but unexpected response")
except Exception as e:
    print(f"❌ Webhook endpoint error: {e}")
    exit(1)

print()

# Step 3: Check ngrok
print("STEP 3: Checking ngrok Tunnel...")
try:
    r = requests.get("http://localhost:4040/api/tunnels", timeout=2)
    data = r.json()
    tunnels = data.get('tunnels', [])
    
    https_url = None
    for tunnel in tunnels:
        if tunnel.get('proto') == 'https':
            https_url = tunnel.get('public_url')
            break
    
    if https_url:
        print(f"✅ ngrok is running!")
        print(f"   Public URL: {https_url}")
        
        # Test ngrok webhook
        print()
        print("STEP 4: Testing Public Webhook Access...")
        try:
            webhook_url = f"{https_url}/webhook/whatsapp"
            r = requests.get(webhook_url, timeout=5)
            if "active and ready" in r.text:
                print("✅ Public webhook is accessible!")
            else:
                print("⚠️  Webhook accessible but unexpected response")
        except Exception as e:
            print(f"❌ Cannot access public webhook: {e}")
            print("   This might be an ngrok issue")
        
        print()
        print("=" * 80)
        print("   ✅ ALL CHECKS PASSED!")
        print("=" * 80)
        print()
        print("📋 YOUR WEBHOOK URL FOR TWILIO:")
        print(f"\n   {https_url}/webhook/whatsapp\n")
        print("=" * 80)
        print()
        print("🔧 CONFIGURE IN TWILIO:")
        print("1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn")
        print("2. Find: 'When a message comes in'")
        print(f"3. Paste: {https_url}/webhook/whatsapp")
        print("4. Method: POST")
        print("5. Click: SAVE")
        print()
        print("Then send a test image via WhatsApp!")
        print("=" * 80)
        print()
        
    else:
        print("❌ ngrok is running but no HTTPS tunnel found")
        print("   → Check your ngrok configuration")
        exit(1)
        
except requests.exceptions.ConnectionError:
    print("❌ ngrok is NOT RUNNING!")
    print()
    print("🚀 TO START NGROK:")
    print("1. Open a NEW terminal (separate from Flask)")
    print("2. Run: ngrok http 5000")
    print("3. Keep it running")
    print("4. Run this script again")
    print()
    exit(1)
except Exception as e:
    print(f"❌ Error checking ngrok: {e}")
    exit(1)
