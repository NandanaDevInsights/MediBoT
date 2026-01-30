import requests
import os

def test_download():
    media_url = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
    headers = {'User-Agent': 'TwilioBot'}
    
    # Simulate the logic in app.py
    TWILIO_ACCOUNT_SID = "" 
    TWILIO_AUTH_TOKEN = ""
    
    print(f"Downloading {media_url}...")
    try:
        if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
             response = requests.get(media_url, auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN), headers=headers)
        else:
             response = requests.get(media_url, headers=headers)
             
        if response.status_code in [400, 401, 403]:
            print(f"Status {response.status_code}, trying fallback...")
            response = requests.get(media_url, headers=headers)
            
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("Download Success!")
        else:
            print(f"Download Failed: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_download()
