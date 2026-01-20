import requests

def simulate():
    try:
        response = requests.post(
            "http://localhost:5000/webhook/whatsapp",
            data={
                "NumMedia": "1",
                "MediaUrl0": "https://dummyimage.com/800x600/ffffff/000000.png&text=CBC+Test",
                "From": "whatsapp:+1234567890",
                "Body": "test"
            }
        )
        print(f"Status: {response.status_code}")
        
        with open("last_webhook_response.txt", "wb") as f:
            f.write(response.content)
        print("Saved response to last_webhook_response.txt")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    simulate()
