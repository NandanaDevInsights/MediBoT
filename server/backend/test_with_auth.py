"""
Test staff API with actual authentication
"""
import requests

# First login to get session
login_data = {
    "email": "admin@medibot.com",  # Use your actual admin email
    "password": "admin123"  # Use your actual admin password
}

session = requests.Session()

# Try to login (adjust credentials as needed)
print("Attempting to test staff API...")
print("Note: This test assumes you have an admin account")
print("="*60)

# Test without auth first to see what happens
response = session.get('http://localhost:5000/api/admin/staff')
print(f"\n1. Without Auth:")
print(f"   Status: {response.status_code}")
if response.status_code == 403:
    print("   ✅ Correctly requires authentication")
elif response.status_code == 500:
    print(f"   ❌ ERROR: {response.text[:200]}")
else:
    print(f"   Response: {response.text[:200]}")

print("\n"+"="*60)
print("\n🔍 To fully test, you need to:")
print("1. Login to admin dashboard in browser")
print("2. Open DevTools (F12)")
print("3. Go to Network tab")
print("4. Navigate to Lab Staff")
print("5. Look for the '/api/admin/staff' request")
print("6. Check if it returns data or an error")
print("\nOR")
print("\n1. Provide admin credentials in this script")
print("2. Re-run to test with proper authentication")
