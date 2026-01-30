import requests

def test_webhook():
    url = "http://localhost:5000/webhook/whatsapp"
    data = {
        "From": "whatsapp:+919847458290",
        "NumMedia": "0",
        "Body": "Hello"
    }
    
    print("Testing Webhook with no media...")
    try:
        response = requests.post(url, data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_webhook()
