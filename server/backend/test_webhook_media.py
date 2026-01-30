import requests

def test_webhook_with_media():
    url = "http://localhost:5000/webhook/whatsapp"
    data = {
        "From": "whatsapp:+919847458290",
        "NumMedia": "1",
        "MediaUrl0": "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
        "MediaContentType0": "image/png"
    }
    
    print("Testing Webhook with Google Logo as media...")
    try:
        response = requests.post(url, data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_webhook_with_media()
