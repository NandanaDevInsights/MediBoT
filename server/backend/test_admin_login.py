import requests

url = "http://localhost:5000/api/admin/login"
payload = {
    "email": "medibot.care@gmail.com",
    "password": "Admin@123"
}

response = requests.post(url, json=payload)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
