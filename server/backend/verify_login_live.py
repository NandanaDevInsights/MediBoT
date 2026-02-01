
import requests

def test_login():
    url = "http://localhost:5000/api/login"
    
    # Test Patient Login
    payload_patient = {
        "username": "patient@example.com",
        "password": "password123"
    }
    print(f"Testing Patient Login: {payload_patient['username']}")
    try:
        resp = requests.post(url, json=payload_patient)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.json()}")
    except Exception as e:
        print(f"Request failed: {e}")

    print("-" * 30)

    # Test Super Admin Login (Should fail on /api/login endpoint as it's restricted)
    # Actually wait, my code allows it but redirects? Or returns 403?
    # Code says: if role in ["LAB_ADMIN", "SUPER_ADMIN"]: strict check for Super Admin.
    # If role == "SUPER_ADMIN" and email != "medibot.care@gmail.com": 403.
    # Else returns success json.
    
    payload_admin = {
        "username": "medibot.care@gmail.com",
        "password": "Admin@123"
    }
    print(f"Testing Super Admin Login: {payload_admin['username']}")
    try:
        resp = requests.post(url, json=payload_admin)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.json()}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_login()
