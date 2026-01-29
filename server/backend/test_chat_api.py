import requests
import json

try:
    response = requests.post(
        'http://localhost:5000/api/chat',
        json={'message': 'Hello', 'history': []},
        timeout=30
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Request Error: {type(e).__name__}: {e}")
