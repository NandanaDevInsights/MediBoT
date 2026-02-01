
import requests
import json
import sys

BASE_URL = "http://localhost:5000/api"

def test_logins():
    print("=== TESTING REAL LOGIN ENDPOINTS ===")
    
    # 1. Test Patient Login (Standard Login)
    print("\n[1] Testing Patient Login (/api/login)")
    payload = {
        "username": "patient@example.com",
        "password": "password123"
    }
    try:
        resp = requests.post(f"{BASE_URL}/login", json=payload)
        print(f"Request: {payload}")
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
    except Exception as e:
        print(f"Request Failed: {e}")

    # 2. Test Admin Login (/api/admin/login)
    print("\n[2] Testing Admin Login (/api/admin/login)")
    payload = {
        "email": "testadmin@lab.com",
        "password": "admin123"
    }
    try:
        resp = requests.post(f"{BASE_URL}/admin/login", json=payload)
        print(f"Request: {payload}")
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
    except Exception as e:
        print(f"Request Failed: {e}")

if __name__ == "__main__":
    test_logins()
