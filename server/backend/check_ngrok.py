"""
Check ngrok status and Twilio webhook configuration
"""
import requests
import json

print("=" * 80)
print("   CHECKING NGROK AND TWILIO CONFIGURATION")
print("=" * 80)
print()

# Check if ngrok is running
print("1. Checking ngrok tunnel...")
try:
    response = requests.get("http://localhost:4040/api/tunnels", timeout=2)
    if response.status_code == 200:
        data = response.json()
        tunnels = data.get('tunnels', [])
        
        if tunnels:
            for tunnel in tunnels:
                if tunnel.get('proto') == 'https':
                    ngrok_url = tunnel.get('public_url')
                    print(f"   ✅ ngrok IS RUNNING!")
                    print(f"   Public URL: {ngrok_url}")
                    print()
                    print("=" * 80)
                    print("   📋 COPY THIS WEBHOOK URL TO TWILIO:")
                    print("=" * 80)
                    webhook_url = f"{ngrok_url}/webhook/whatsapp"
                    print(f"\n   {webhook_url}\n")
                    print("=" * 80)
                    print()
                    print("2. Configure in Twilio:")
                    print("   https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn")
                    print()
                    print("   Find: 'When a message comes in'")
                    print(f"   Paste: {webhook_url}")
                    print("   Method: POST")
                    print("   Click: SAVE")
                    print()
                    print("3. Test the webhook:")
                    print(f"   Visit: {ngrok_url}/webhook/whatsapp")
                    print("   You should see: 'WhatsApp webhook is active and ready!'")
                    print()
                    break
            else:
                print("   ⚠️  ngrok running but no HTTPS tunnel found")
        else:
            print("   ❌ ngrok running but no tunnels active")
    else:
        print("   ❌ ngrok API not responding properly")
except requests.exceptions.ConnectionError:
    print("   ❌ ngrok is NOT RUNNING!")
    print()
    print("   🚀 START NGROK NOW:")
    print("   1. Open a NEW terminal (separate from Flask)")
    print("   2. Run: ngrok http 5000")
    print("   3. Look for the HTTPS forwarding URL")
    print("   4. Run this script again")
    print()
except Exception as e:
    print(f"   ❌ Error: {e}")

print("=" * 80)
print()
