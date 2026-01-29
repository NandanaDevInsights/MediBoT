"""
Quick test script to verify Razorpay endpoints are working
Run this after starting the Flask backend (python app.py)
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_create_payment_order():
    """Test the create payment order endpoint"""
    print("\n🧪 Testing: Create Payment Order...")
    
    payload = {
        "amount": 500,  # ₹500
        "notes": {
            "lab": "Test Lab",
            "tests": "Blood Test, CBC",
            "date": "2026-01-30",
            "time": "10:00"
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/create-payment-order",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Success!")
            print(f"Order ID: {data.get('order_id')}")
            print(f"Amount (Paise): {data.get('amount')}")
            print(f"Currency: {data.get('currency')}")
            print(f"Key ID: {data.get('key')}")
            return data.get('order_id')
        else:
            print("❌ Failed!")
            print(f"Error: {response.json()}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_backend_health():
    """Test if backend is running"""
    print("\n🧪 Testing: Backend Health...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            print("✅ Backend is running!")
            return True
        else:
            print("❌ Backend returned error")
            return False
    except Exception as e:
        print(f"❌ Backend not reachable: {e}")
        print("👉 Make sure backend is running with: python app.py")
        return False


def check_razorpay_config():
    """Check if Razorpay credentials are configured"""
    print("\n🧪 Checking: Razorpay Configuration...")
    
    import os
    from dotenv import load_dotenv
    
    # Load from backend directory
    backend_env = "c:/Users/NANDANA PRAMOD/Documents/MediBot/server/backend/.env"
    load_dotenv(backend_env)
    
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")
    
    if key_id and key_secret:
        print("✅ Razorpay credentials found!")
        print(f"Key ID: {key_id[:10]}... (hidden)")
        print(f"Key Secret: {'*' * len(key_secret)}")
        return True
    else:
        print("❌ Razorpay credentials not found in .env")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("🔐 RAZORPAY INTEGRATION TEST")
    print("=" * 60)
    
    # Step 1: Check Razorpay config
    config_ok = check_razorpay_config()
    
    # Step 2: Check backend health
    backend_ok = test_backend_health()
    
    if not backend_ok:
        print("\n⚠️  Please start the backend first:")
        print("   cd server/backend")
        print("   python app.py")
        exit(1)
    
    # Step 3: Test create payment order
    order_id = test_create_payment_order()
    
    print("\n" + "=" * 60)
    if config_ok and backend_ok and order_id:
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        print("\n📝 Next Steps:")
        print("1. Start frontend: npm run dev")
        print("2. Navigate to landing page")
        print("3. Book a test and try Razorpay payment")
        print("\n💡 Test Card Details:")
        print("   Card Number: 4111 1111 1111 1111")
        print("   CVV: 123")
        print("   Expiry: 12/25")
        print("\n💡 Test UPI ID:")
        print("   success@razorpay")
    else:
        print("❌ SOME TESTS FAILED")
        print("=" * 60)
        print("\n👉 Check the errors above and fix them")
    
    print("\n")
