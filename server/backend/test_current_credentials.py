"""
Test Current Twilio Credentials
Shows exactly what's configured and if it works
"""
import os
from dotenv import load_dotenv
import requests

load_dotenv(override=True)

print("=" * 80)
print("TESTING CURRENT TWILIO CREDENTIALS")
print("=" * 80)
print()

# Get credentials
account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
auth_token = os.environ.get("TWILIO_AUTH_TOKEN")

print("Currently configured credentials:")
print(f"  TWILIO_ACCOUNT_SID: {account_sid}")
print(f"  TWILIO_AUTH_TOKEN:  {auth_token[:10]}...{auth_token[-4:] if auth_token else 'NOT SET'}")
print()

if not account_sid or not auth_token:
    print("❌ ERROR: Credentials not found in .env file!")
    print()
    print("Make sure your .env file has:")
    print("  TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    print("  TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    exit(1)

# Test authentication
print("Testing authentication with Twilio API...")
test_url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}.json"

try:
    response = requests.get(
        test_url,
        auth=(account_sid, auth_token),
        timeout=10
    )
    
    print(f"Response Status: {response.status_code}")
    print()
    
    if response.status_code == 200:
        print("✅ SUCCESS! Your credentials are VALID!")
        data = response.json()
        print(f"   Account Name: {data.get('friendly_name')}")
        print(f"   Account Status: {data.get('status')}")
        print()
        print("✅ The credentials are working correctly!")
        print("   The 401 error must be caused by something else.")
        print()
        
    elif response.status_code == 401:
        print("❌ AUTHENTICATION FAILED!")
        print()
        print("Your credentials are INVALID or EXPIRED!")
        print()
        print("Error details:")
        print(response.text)
        print()
        print("=" * 80)
        print("HOW TO FIX:")
        print("=" * 80)
        print("1. Go to: https://console.twilio.com/")
        print("2. Log in to your account")
        print("3. Look at 'Account Info' section (usually top-left)")
        print("4. Find your Account SID")
        print("5. Click 'View' or 'Show' next to Auth Token")
        print()
        print("   ⚠️ If you see 'Reset Auth Token' button, your token might be hidden")
        print("   You may need to RESET it to get a new one")
        print()
        print("6. Copy BOTH values")
        print("7. Update your .env file")
        print("8. Restart Flask server (Ctrl+C, then python app.py)")
        print()
        
    else:
        print(f"❌ Unexpected error: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"❌ Connection error: {e}")
    print()
    print("Make sure you have internet connection")

print("=" * 80)
