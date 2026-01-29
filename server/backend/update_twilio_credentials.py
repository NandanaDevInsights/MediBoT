"""
Script to update Twilio credentials in .env file
"""
import os
import re

def update_twilio_credentials():
    print("=" * 60)
    print("     TWILIO CREDENTIALS UPDATER")
    print("=" * 60)
    print()
    print("Get your credentials from: https://console.twilio.com/")
    print()
    
    # Get new credentials from user
    account_sid = input("Enter your TWILIO_ACCOUNT_SID: ").strip()
    auth_token = input("Enter your TWILIO_AUTH_TOKEN: ").strip()
    
    if not account_sid or not auth_token:
        print("\n❌ Error: Both Account SID and Auth Token are required!")
        return
    
    # Validate format
    if not account_sid.startswith("AC") or len(account_sid) != 34:
        print("\n⚠️ Warning: Account SID should start with 'AC' and be 34 characters long")
        proceed = input("Continue anyway? (y/n): ").strip().lower()
        if proceed != 'y':
            return
    
    if len(auth_token) != 32:
        print("\n⚠️ Warning: Auth Token should be 32 characters long")
        proceed = input("Continue anyway? (y/n): ").strip().lower()
        if proceed != 'y':
            return
    
    # Read current .env file
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    
    if not os.path.exists(env_path):
        print(f"\n❌ Error: .env file not found at {env_path}")
        return
    
    with open(env_path, 'r') as f:
        content = f.read()
    
    # Update credentials
    original_content = content
    
    # Update Account SID
    content = re.sub(
        r'TWILIO_ACCOUNT_SID=.*',
        f'TWILIO_ACCOUNT_SID={account_sid}',
        content
    )
    
    # Update Auth Token
    content = re.sub(
        r'TWILIO_AUTH_TOKEN=.*',
        f'TWILIO_AUTH_TOKEN={auth_token}',
        content
    )
    
    # Check if anything changed
    if content == original_content:
        print("\n⚠️ Warning: No changes were made. Make sure the variables exist in .env")
        return
    
    # Write back to file
    with open(env_path, 'w') as f:
        f.write(content)
    
    print("\n✅ SUCCESS! Credentials updated in .env file")
    print("\n" + "=" * 60)
    print("NEXT STEPS:")
    print("=" * 60)
    print("1. Restart your Flask server:")
    print("   - Press Ctrl+C to stop it")
    print("   - Run: python app.py")
    print()
    print("2. Test your credentials:")
    print("   - Run: python test_twilio_auth.py")
    print()
    print("3. Send a test image via WhatsApp")
    print("=" * 60)

if __name__ == "__main__":
    update_twilio_credentials()
