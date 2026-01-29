import requests
import sys

try:
    r = requests.get("http://localhost:4040/api/tunnels", timeout=3)
    data = r.json()
    tunnels = data.get('tunnels', [])
    
    for tunnel in tunnels:
        if tunnel.get('proto') == 'https':
            ngrok_url = tunnel.get('public_url')
            webhook_url = f"{ngrok_url}/webhook/whatsapp"
            
            print("=" * 80)
            print("✅ ngrok IS RUNNING!")
            print("=" * 80)
            print()
            print("YOUR WEBHOOK URL:")
            print(webhook_url)
            print()
            print("=" * 80)
            print("COPY THIS URL AND PASTE IT IN TWILIO:")
            print("=" * 80)
            print()
            print("1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn")
            print("2. Find: 'When a message comes in'")
            print(f"3. Paste: {webhook_url}")
            print("4. Method: POST")
            print("5. Click: SAVE")
            print()
            sys.exit(0)
    
    print("❌ ngrok running but no HTTPS tunnel found")
    sys.exit(1)
    
except requests.exceptions.ConnectionError:
    print("=" * 80)
    print("❌ ngrok is NOT RUNNING!")
    print("=" * 80)
    print()
    print("START NGROK NOW:")
    print("1. Open a NEW terminal")
    print("2. Run: ngrok http 5000")
    print("3. Keep it running")
    print()
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
