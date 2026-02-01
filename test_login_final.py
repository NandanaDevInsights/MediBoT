"""
Test the login endpoint with the correct credentials
"""
import requests
import json

API_BASE = 'http://localhost:5000/api'

# Test credentials that should now exist
test_cases = [
    {
        'name': 'Login with patient email',
        'data': {'username': 'patient@example.com', 'password': 'Patient@123'}
    },
    {
        'name': 'Login with patient username',
        'data': {'username': 'patient', 'password': 'Patient@123'}
    },
    {
        'name': 'Login with admin email',
        'data': {'username': 'admin@example.com', 'password': 'Admin@123'}
    },
    {
        'name': 'Login with admin username',
        'data': {'username': 'admin', 'password': 'Admin@123'}
    },
    {
        'name': 'Login with testuser username',
        'data': {'username': 'testuser', 'password': 'Test@123'}
    },
    {
        'name': 'Login with testuser email',
        'data': {'username': 'user@test.com', 'password': 'Test@123'}
    },
]

print("=" * 80)
print("TESTING LOGIN ENDPOINT")
print("=" * 80)

for test in test_cases:
    print(f"\n{test['name']}:")
    print(f"  Username: {test['data']['username']}")
    
    try:
        response = requests.post(
            f'{API_BASE}/login',
            json=test['data'],
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"  Status: {response.status_code}")
        
        try:
            data = response.json()
            if response.status_code == 200:
                print(f"  ✓ SUCCESS")
                if 'require_otp' in data and data['require_otp']:
                    print(f"  → OTP required, sent to: {data.get('email')}")
                else:
                    print(f"  → Direct login successful")
                    print(f"  → Role: {data.get('role')}")
            else:
                print(f"  ✗ FAILED: {data.get('message')}")
        except:
            print(f"  ✗ Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("  ✗ ERROR: Could not connect to backend server")
        print("  → Please make sure Flask server is running on http://localhost:5000")
        break
    except Exception as e:
        print(f"  ✗ ERROR: {e}")

print("\n" + "=" * 80)
