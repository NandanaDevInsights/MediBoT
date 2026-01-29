"""
Test script to verify Twilio credentials
"""
import os
from dotenv import load_dotenv
import requests

load_dotenv(override=True)

TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")

print(f"Account SID: {TWILIO_ACCOUNT_SID}")
print(f"Auth Token (first 10 chars): {TWILIO_AUTH_TOKEN[:10]}...")

# Test auth by checking Twilio account
test_url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}.json"

try:
    response = requests.get(
        test_url,
        auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    )
    
    print(f"\nStatus Code: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Twilio credentials are VALID!")
        account_data = response.json()
        print(f"Account Name: {account_data.get('friendly_name')}")
        print(f"Account Status: {account_data.get('status')}")
    elif response.status_code == 401:
        print("❌ AUTHENTICATION FAILED!")
        print("Your Twilio credentials are INVALID or EXPIRED.")
        print("\nPossible reasons:")
        print("1. Auth Token has been reset/changed in Twilio Console")
        print("2. Account SID is incorrect")
        print("3. Account has been suspended")
        print("\nPlease visit: https://console.twilio.com/")
        print("Go to Account > API keys & tokens to get your current Auth Token")
    else:
        print(f"❌ Unexpected error: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"❌ Connection error: {e}")
