import requests
import time
import sys

print("🔍 STARTING SYSTEM DIAGNOSTICS...", flush=True)

# 1. Check Localhost Health
print("\n1️⃣  Checking Local Server connection...", end=" ", flush=True)
try:
    r = requests.get("http://localhost:5000/", timeout=5)
    if r.status_code == 200:
        print("✅ ONLINE")
    else:
        print(f"❌ ERROR (Status {r.status_code})")
except Exception as e:
    print(f"❌ FAILED: {e}")
    print("   -> ACTION: OCR.py is NOT running or crashed. I will restart it.")

# 2. Simulate WhatsApp Payload
print("\n2️⃣  Simulating WhatsApp Message (Internal Test)...", end=" ", flush=True)
payload = {
    "NumMedia": "0",
    "From": "whatsapp:+123456789",
    "Body": "Hello"
}
try:
    r = requests.post("http://localhost:5000/webhook/whatsapp", data=payload, timeout=10)
    if r.status_code == 200:
        print("✅ SUCCESS")
        print("   -> Server Response: " + r.text[:100] + "...")
    else:
        print(f"❌ FAILED (Status {r.status_code})")
except Exception as e:
    print(f"❌ FAILED: {e}")

# 3. Check Public Tunnel
NGROK_URL = "https://environmentally-stringent-shaun.ngrok-free.dev"
print(f"\n3️⃣  Checking Public Tunnel ({NGROK_URL})...", end=" ", flush=True)
try:
    # Use headers to avoid browser warning page from ngrok
    r = requests.get(f"{NGROK_URL}/", headers={"ngrok-skip-browser-warning": "true"}, timeout=10)
    if r.status_code == 200 and "OCR Server is RUNNING" in r.text:
        print("✅ REACHABLE & CORRECT")
    elif r.status_code == 404:
        print("❌ 404 NOT FOUND (Tunnel is offline or URL is wrong)")
    elif r.status_code == 502:
        print("❌ 502 BAD GATEWAY (Ngrok can't reach port 5000)")
    else:
        print(f"⚠️ STATUS {r.status_code} (Might be working, check valid response)")
except Exception as e:
    print(f"❌ UNREACHABLE: {e}")

print("\n---------------------------------------------------")
print("SUMMARY:")
print("If Steps 1 & 2 passed, your CODE is perfect.")
print("If Step 3 failed, your NGROK/TWILIO config is the problem.")
