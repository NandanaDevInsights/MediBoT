"""
WhatsApp Webhook Setup Helper
Checks if ngrok is running and provides setup instructions
"""
import os
import requests
import json
import subprocess

def check_ngrok_installed():
    """Check if ngrok is installed"""
    try:
        result = subprocess.run(['ngrok', 'version'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if result.returncode == 0:
            return True, result.stdout.strip()
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass
    return False, None

def get_ngrok_url():
    """Get the current ngrok tunnel URL"""
    try:
        response = requests.get('http://localhost:4040/api/tunnels', timeout=2)
        if response.status_code == 200:
            data = response.json()
            tunnels = data.get('tunnels', [])
            for tunnel in tunnels:
                if tunnel.get('proto') == 'https':
                    return tunnel.get('public_url')
    except requests.exceptions.RequestException:
        pass
    return None

def main():
    print("=" * 80)
    print("     WHATSAPP WEBHOOK SETUP HELPER")
    print("=" * 80)
    print()
    
    # Step 1: Check if Flask is running
    print("1. Checking Flask Server...")
    try:
        response = requests.get('http://localhost:5000/', timeout=2)
        print("   ✅ Flask server is running on http://localhost:5000")
    except requests.exceptions.RequestException:
        print("   ❌ Flask server is NOT running!")
        print("   → Start it with: python app.py")
        print()
        return
    
    # Step 2: Check if ngrok is installed
    print("\n2. Checking ngrok Installation...")
    is_installed, version = check_ngrok_installed()
    
    if is_installed:
        print(f"   ✅ ngrok is installed ({version})")
    else:
        print("   ❌ ngrok is NOT installed")
        print("\n   📥 TO INSTALL:")
        print("   1. Download from: https://ngrok.com/download")
        print("   2. Extract to a folder (e.g., C:\\ngrok\\)")
        print("   3. Add to PATH or run from that folder")
        print("\n   OR install via Chocolatey:")
        print("   choco install ngrok")
        print()
        return
    
    # Step 3: Check if ngrok is running
    print("\n3. Checking ngrok Tunnel...")
    ngrok_url = get_ngrok_url()
    
    if ngrok_url:
        print(f"   ✅ ngrok tunnel is ACTIVE!")
        print(f"   🌐 Public URL: {ngrok_url}")
        
        webhook_url = f"{ngrok_url}/webhook/whatsapp"
        
        print("\n" + "=" * 80)
        print("📋 NEXT STEPS:")
        print("=" * 80)
        print()
        print("1. Copy this Webhook URL:")
        print(f"\n   {webhook_url}\n")
        
        print("2. Go to Twilio Console:")
        print("   https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn")
        
        print("\n3. Configure the webhook:")
        print("   - Find 'When a message comes in' field")
        print(f"   - Paste: {webhook_url}")
        print("   - Method: POST")
        print("   - Click SAVE")
        
        print("\n4. Test by sending a prescription image via WhatsApp!")
        
        print("\n5. Watch your Flask terminal for logs:")
        print("   [INFO] Webhook HIT - Processing Prescription")
        print("   [DEBUG] Attempting download with Account SID...")
        print("   [INFO] Image downloaded...")
        
        print("\n" + "=" * 80)
        print("⚠️  IMPORTANT: Keep ngrok running while testing!")
        print("=" * 80)
        
    else:
        print("   ❌ ngrok tunnel is NOT running")
        print("\n   🚀 TO START ngrok:")
        print("   1. Open a NEW terminal (keep Flask running in the other one)")
        print("   2. Run: ngrok http 5000")
        print("   3. Look for the HTTPS forwarding URL")
        print("   4. Run this script again to get the webhook URL")
        print()
        print("   Example ngrok output:")
        print("   Forwarding   https://XXXX-YYYY.ngrok-free.app -> http://localhost:5000")
        print()
    
    print()

if __name__ == "__main__":
    main()
