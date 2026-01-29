"""
Test the staff API endpoint directly
"""
import requests

try:
    # Test the endpoint
    response = requests.get(
        'http://localhost:5000/api/admin/staff',
        cookies={'session': 'test'}  # We'll test without auth first to see the error
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:500]}")  # First 500 chars
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ Success! Retrieved {len(data)} staff members")
        if len(data) > 0:
            print("\nFirst staff member:")
            print(data[0])
    elif response.status_code == 403:
        print("\n⚠️  Authentication required (expected)")
        print("This means the endpoint exists but needs proper login")
    else:
        print(f"\n❌ Error: {response.status_code}")
        
except requests.exceptions.ConnectionError:
    print("❌ ERROR: Cannot connect to backend server!")
    print("Make sure Flask is running on http://localhost:5000")
except Exception as e:
    print(f"❌ Error: {e}")
