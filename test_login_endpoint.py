import requests
import json

# Test login endpoint
API_BASE = 'http://localhost:5000/api'

# Test with different credentials
test_credentials = [
    {"username": "admin@example.com", "password": "Test@1234"},
    {"username": "patient@example.com", "password": "Test@1234"},
    {"username": "testuser", "password": "Test@1234"},
]

print("=" * 80)
print("TESTING LOGIN ENDPOINT")
print("=" * 80)

for creds in test_credentials:
    print(f"\nTesting login with: {creds['username']}")
    try:
        response = requests.post(
            f'{API_BASE}/login',
            json=creds,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"  Status Code: {response.status_code}")
        try:
            data = response.json()
            print(f"  Response: {json.dumps(data, indent=2)}")
        except:
            print(f"  Response Text: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("  ✗ ERROR: Could not connect to backend server at http://localhost:5000")
        print("  Please make sure the Flask server is running.")
        break
    except Exception as e:
        print(f"  ✗ ERROR: {e}")

print("\n" + "=" * 80)
