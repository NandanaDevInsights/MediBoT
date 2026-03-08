import os
from twilio.rest import Client
from dotenv import load_dotenv
import mysql.connector

load_dotenv()

account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
from_number = os.environ.get('TWILIO_WHATSAPP_NUMBER') or os.environ.get('TWILIO_PHONE_NUMBER')

if not account_sid or not auth_token or not from_number:
    print("Twilio credentials missing.")
    exit(1)

client = Client(account_sid, auth_token)

try:
    conn = mysql.connector.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        user=os.environ.get('DB_USER', 'root'),
        password=os.environ.get('DB_PASS', ''),    
        database=os.environ.get('DB_NAME', 'medibot_db')
    )
except mysql.connector.Error as err:
    # try with root as password
    conn = mysql.connector.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        user=os.environ.get('DB_USER', 'root'),
        password=os.environ.get('DB_PASS', 'root'),    
        database=os.environ.get('DB_NAME', 'medibot_db')
    )
    
cur = conn.cursor(dictionary=True)
cur.execute('SELECT id FROM reports ORDER BY uploaded_at DESC LIMIT 1')
row = cur.fetchone()

if row:
    report_id = row['id']
    base_url = "http://localhost:5000/"
    if os.path.exists("WEBHOOK_URL.txt"):
        with open("WEBHOOK_URL.txt", "r") as f:
            webhook_url = f.read().strip()
            if webhook_url.startswith("http"):
                from urllib.parse import urlparse
                parsed = urlparse(webhook_url)
                base_url = f"{parsed.scheme}://{parsed.netloc}/"
                
    media_link = f"{base_url.rstrip('/')}/api/view-report/{report_id}"
    
    patient_phone = "whatsapp:+919847458290"
    msg_body = f"📄 *LAB REPORT ATTACHED*\n\nHello, your diagnostic report is now available.\n🔗 {media_link}"
    
    clean_from = str(from_number).strip()
    if not clean_from.lower().startswith("whatsapp:"):
        clean_from = f"whatsapp:{clean_from}"

    message_args = {
        'from_': clean_from,
        'body': msg_body,
        'to': patient_phone,
        'media_url': [media_link]
    }
    
    print(f"Sending to {patient_phone} with media {media_link}...")
    message = client.messages.create(**message_args)
    print(f"Message sent SID: {message.sid}")
else:
    print('No reports found')
