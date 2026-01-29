
import requests
import json
import os

BASE_URL = "http://localhost:5000/api"

def test_create_order():
    print("Testing /api/create-payment-order...")
    try:
        payload = {
            "amount": 500,
            "notes": {"test": "true"}
        }
        resp = requests.post(f"{BASE_URL}/create-payment-order", json=payload)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_create_order()
