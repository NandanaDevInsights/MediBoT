"""
Complete WhatsApp OCR Diagnostic
Run this AFTER restarting Flask server
"""
import os
from dotenv import load_dotenv
import requests
import sys

load_dotenv(override=True)

def test_all():
    print("=" * 90)
    print("                    WHATSAPP OCR COMPLETE DIAGNOSTIC")
    print("=" * 90)
    print()
    
    issues = []
    warnings = []
    
    # Test 1: Twilio Credentials
    print("📋 TEST 1: Twilio Credentials")
    print("-" * 90)
    
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    
    if not account_sid or not auth_token:
        print("❌ FAIL: Credentials not found in .env")
        issues.append("Twilio credentials missing")
    else:
        print(f"✅ Account SID: {account_sid}")
        print(f"✅ Auth Token: {auth_token[:8]}...{auth_token[-4:]}")
        
        # Test auth
        try:
            test_url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}.json"
            response = requests.get(test_url, auth=(account_sid, auth_token), timeout=10)
            
            if response.status_code == 200:
                print("✅ CREDENTIALS ARE VALID!")
                data = response.json()
                print(f"   Account: {data.get('friendly_name')} ({data.get('status')})")
            elif response.status_code == 401:
                print("❌ CREDENTIALS ARE INVALID!")
                issues.append("Twilio credentials invalid - update them from Twilio Console")
            else:
                print(f"⚠️  Unexpected response: {response.status_code}")
                warnings.append(f"Twilio API returned {response.status_code}")
        except Exception as e:
            print(f"❌ Connection error: {e}")
            issues.append(f"Cannot connect to Twilio API: {e}")
    
    print()
    
    # Test 2: Flask Server
    print("📋 TEST 2: Flask Server")
    print("-" * 90)
    
    try:
        response = requests.get("http://localhost:5000/", timeout=2)
        print("✅ Flask server is running on http://localhost:5000")
    except:
        print("❌ Flask server is NOT running!")
        issues.append("Flask server not running - start with: python app.py")
    
    print()
    
    # Test 3: Webhook Endpoint
    print("📋 TEST 3: Webhook Endpoint")
    print("-" * 90)
    
    try:
        response = requests.get("http://localhost:5000/webhook/whatsapp", timeout=2)
        if response.status_code == 200:
            print("✅ Webhook endpoint is accessible")
            print(f"   Response: {response.text}")
        else:
            print(f"⚠️  Webhook returned status: {response.status_code}")
    except Exception as e:
        print(f"❌ Cannot reach webhook: {e}")
        issues.append("Webhook endpoint not accessible")
    
    print()
    
    # Test 4: ngrok
    print("📋 TEST 4: ngrok Tunnel")
    print("-" * 90)
    
    try:
        response = requests.get("http://localhost:4040/api/tunnels", timeout=2)
        if response.status_code == 200:
            data = response.json()
            tunnels = data.get('tunnels', [])
            https_tunnel = None
            for tunnel in tunnels:
                if tunnel.get('proto') == 'https':
                    https_tunnel = tunnel.get('public_url')
                    break
            
            if https_tunnel:
                print(f"✅ ngrok is running!")
                print(f"   Public URL: {https_tunnel}")
                print(f"\n   📌 YOUR WEBHOOK URL FOR TWILIO:")
                print(f"   {https_tunnel}/webhook/whatsapp")
                print()
            else:
                print("⚠️  ngrok is running but no HTTPS tunnel found")
                warnings.append("Check ngrok configuration")
        else:
            print("❌ ngrok API not responding")
            issues.append("ngrok not running - start with: ngrok http 5000")
    except:
        print("❌ ngrok is NOT running!")
        issues.append("ngrok not running - start with: ngrok http 5000")
    
    print()
    
    # Test 5: Database
    print("📋 TEST 5: Database Connection")
    print("-" * 90)
    
    try:
        from db_connect import get_connection
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT 1")
        cur.fetchone()
        conn.close()
        print("✅ Database connection OK")
    except Exception as e:
        print(f"❌ Database error: {e}")
        issues.append(f"Database connection failed: {e}")
    
    print()
    print("=" * 90)
    print("SUMMARY")
    print("=" * 90)
    
    if not issues and not warnings:
        print("🎉 ALL TESTS PASSED!")
        print()
        print("✅ Ready to receive WhatsApp messages!")
        print()
        print("📱 TO TEST:")
        print("   1. Send a prescription image via WhatsApp")
        print("   2. Watch your Flask terminal for logs")
        print("   3. You should receive a reply with extracted text")
        print()
        
    else:
        if issues:
            print(f"\n❌ CRITICAL ISSUES ({len(issues)}):")
            for i, issue in enumerate(issues, 1):
                print(f"   {i}. {issue}")
        
        if warnings:
            print(f"\n⚠️  WARNINGS ({len(warnings)}):")
            for i, warning in enumerate(warnings, 1):
                print(f"   {i}. {warning}")
        
        print("\n📋 ACTION REQUIRED:")
        
        if any("credentials" in issue.lower() for issue in issues):
            print("\n1️⃣  UPDATE TWILIO CREDENTIALS:")
            print("   - Go to: https://console.twilio.com/")
            print("   - Get Account SID and Auth Token")
            print("   - Update .env file")
            print("   - RESTART Flask server (IMPORTANT!)")
        
        if any("Flask server" in issue for issue in issues):
            print("\n2️⃣  START FLASK SERVER:")
            print("   cd c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend")
            print("   python app.py")
        
        if any("ngrok" in issue for issue in issues):
            print("\n3️⃣  START NGROK:")
            print("   Open new terminal and run:")
            print("   ngrok http 5000")
            print("   Then copy the HTTPS URL to Twilio webhook")
    
    print("=" * 90)
    print()
    
    return len(issues) == 0

if __name__ == "__main__":
    success = test_all()
    sys.exit(0 if success else 1)
