import requests

url = "http://127.0.0.1:5000/api/admin/login"
data = {
    "email": "admin@example.com",
    "password": "admin123"
}

response = requests.post(url, json=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
