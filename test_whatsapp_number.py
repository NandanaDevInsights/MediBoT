import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv('server/backend/.env')
sid = os.environ.get('TWILIO_ACCOUNT_SID')
token = os.environ.get('TWILIO_AUTH_TOKEN')
from_n = os.environ.get('TWILIO_WHATSAPP_NUMBER')

print(f"SID: {sid[:10]}...")
print(f"From: {from_n}")

client = Client(sid, token)
target = 'whatsapp:98474458290'
print(f"Sending to: {target}")

try:
    msg = client.messages.create(
        from_=from_n,
        body='Test from MediBot - Debugging Notification',
        to=target
    )
    print('Success:', msg.sid)
except Exception as e:
    print('Error:', e)
