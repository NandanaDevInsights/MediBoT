"""
Complete WhatsApp OCR Setup Validator
Tests all components needed for WhatsApp prescription processing
"""
import os
from dotenv import load_dotenv
import requests

load_dotenv(override=True)

def check_mark(passed):
    return "✅" if passed else "❌"

def test_setup():
    print("=" * 70)
    print("     WHATSAPP OCR SETUP VALIDATOR")
    print("=" * 70)
    print()
    
    issues = []
    
    # 1. Check Twilio Credentials
    print("1. Checking Twilio Credentials...")
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    
    if not account_sid:
        print(f"   {check_mark(False)} TWILIO_ACCOUNT_SID not found in .env")
        issues.append("Missing TWILIO_ACCOUNT_SID")
    elif not account_sid.startswith("AC") or len(account_sid) != 34:
        print(f"   {check_mark(False)} TWILIO_ACCOUNT_SID has invalid format")
        issues.append("Invalid TWILIO_ACCOUNT_SID format")
    else:
        print(f"   {check_mark(True)} TWILIO_ACCOUNT_SID found: {account_sid[:10]}...")
    
    if not auth_token:
        print(f"   {check_mark(False)} TWILIO_AUTH_TOKEN not found in .env")
        issues.append("Missing TWILIO_AUTH_TOKEN")
    elif len(auth_token) != 32:
        print(f"   {check_mark(False)} TWILIO_AUTH_TOKEN has invalid length (should be 32)")
        issues.append("Invalid TWILIO_AUTH_TOKEN length")
    else:
        print(f"   {check_mark(True)} TWILIO_AUTH_TOKEN found (32 chars)")
    
    # 2. Test Twilio API Connection
    print("\n2. Testing Twilio API Authentication...")
    if account_sid and auth_token:
        try:
            test_url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}.json"
            response = requests.get(
                test_url,
                auth=(account_sid, auth_token),
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"   {check_mark(True)} Twilio API authentication SUCCESSFUL!")
                account_data = response.json()
                print(f"   Account: {account_data.get('friendly_name')}")
                print(f"   Status: {account_data.get('status')}")
            elif response.status_code == 401:
                print(f"   {check_mark(False)} Twilio API authentication FAILED (401)")
                print(f"   Error: Invalid credentials or expired token")
                issues.append("Twilio authentication failed - update credentials")
            else:
                print(f"   {check_mark(False)} Unexpected response: {response.status_code}")
                issues.append(f"Twilio API error: {response.status_code}")
        except Exception as e:
            print(f"   {check_mark(False)} Connection error: {e}")
            issues.append(f"Twilio API connection failed: {e}")
    else:
        print(f"   {check_mark(False)} Skipped (credentials missing)")
    
    # 3. Check Google Vision Credentials
    print("\n3. Checking Google Vision OCR Setup...")
    google_key_path = os.path.join(os.path.dirname(__file__), "google_key.json")
    
    if os.path.exists(google_key_path):
        print(f"   {check_mark(True)} google_key.json found")
        try:
            from google.cloud import vision
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_key_path
            client = vision.ImageAnnotatorClient()
            print(f"   {check_mark(True)} Google Vision client initialized successfully")
        except Exception as e:
            print(f"   {check_mark(False)} Google Vision initialization failed: {e}")
            issues.append(f"Google Vision error: {e}")
    else:
        print(f"   {check_mark(False)} google_key.json not found")
        print(f"   Will fallback to OCR.Space API")
    
    # 4. Check OCR.Space Fallback
    print("\n4. Checking OCR.Space Fallback...")
    ocr_api_key = os.environ.get("OCR_SPACE_API_KEY")
    if ocr_api_key and ocr_api_key != "helloworld":
        print(f"   {check_mark(True)} OCR_SPACE_API_KEY configured")
    else:
        print(f"   ⚠️  Using default key (limited requests)")
    
    # 5. Check Database Connection
    print("\n5. Checking Database Connection...")
    try:
        from db_connect import get_connection
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        conn.close()
        print(f"   {check_mark(True)} Database connection successful")
    except Exception as e:
        print(f"   {check_mark(False)} Database connection failed: {e}")
        issues.append(f"Database error: {e}")
    
    # 6. Check Prescriptions Table
    print("\n6. Checking prescriptions table...")
    try:
        from db_connect import get_connection
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES LIKE 'prescriptions'")
        if cursor.fetchone():
            print(f"   {check_mark(True)} prescriptions table exists")
        else:
            print(f"   {check_mark(False)} prescriptions table not found")
            issues.append("prescriptions table missing")
        conn.close()
    except Exception as e:
        print(f"   {check_mark(False)} Error checking table: {e}")
    
    # 7. Check Static Directory
    print("\n7. Checking static/prescriptions directory...")
    static_dir = os.path.join(os.path.dirname(__file__), "static", "prescriptions")
    if os.path.exists(static_dir):
        print(f"   {check_mark(True)} Directory exists: {static_dir}")
    else:
        print(f"   ⚠️  Will be created automatically when needed")
    
    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    
    if not issues:
        print("✅ ALL CHECKS PASSED! Your WhatsApp OCR is ready to use.")
        print("\nNext steps:")
        print("1. Make sure your Flask server is running (python app.py)")
        print("2. Send a prescription image via WhatsApp to test")
    else:
        print(f"❌ Found {len(issues)} issue(s):\n")
        for i, issue in enumerate(issues, 1):
            print(f"   {i}. {issue}")
        print("\n📋 TO FIX:")
        if any("Twilio" in issue for issue in issues):
            print("   - Run: python update_twilio_credentials.py")
            print("   - Get your credentials from: https://console.twilio.com/")
        if any("Database" in issue for issue in issues):
            print("   - Check your database connection settings in .env")
            print("   - Make sure MariaDB/MySQL is running")
    
    print("=" * 70)

if __name__ == "__main__":
    test_setup()
