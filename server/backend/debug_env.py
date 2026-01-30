import os
from dotenv import load_dotenv

load_dotenv()

sid = os.environ.get("TWILIO_ACCOUNT_SID")
token = os.environ.get("TWILIO_AUTH_TOKEN")

print(f"SID: '{sid}' (Length: {len(sid) if sid else 0})")
print(f"Token: '{token}' (Length: {len(token) if token else 0})")

# Check for whitespace
if sid and sid.strip() != sid:
    print("Warning: SID has whitespace!")
if token and token.strip() != token:
    print("Warning: Token has whitespace!")
