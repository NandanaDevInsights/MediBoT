
import requests
import json
import os

SESSION_COOKIE = "" # We don't have a valid session cookie easily without login.
# But we can query the DB to find a user, then simulate the logic or just rely on manual verification if auth is hard.
# Actually, we can use the 'users' table to find an ID, then simply print the URL we WOULD call.
# Or we can temporarily disable auth on the endpoint? No, that's risky.
# Better: We can rely on the python 'app' context to call the function directly!

from app import app, get_patient_history
from flask import session

def test_backend_function():
    print("Testing get_patient_history logic directly...")
    
    # Needs app context and a mock session
    with app.test_request_context():
        # Mock admin session
        with app.session_transaction() as sess:
            sess['role'] = 'LAB_ADMIN'
            
        # 1. Find a real user ID
        from db_connect import get_connection
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE role='USER' LIMIT 1")
        u_row = cur.fetchone()
        
        if u_row:
            uid = u_row[0]
            print(f"Testing Registered User ID: {uid}")
            response, status = get_patient_history(str(uid))
            print(f"Status: {status}")
            print("Response Keys:", response.json.keys())
            print("Prescriptions Count:", len(response.json['prescriptions']))
        else:
            print("No registered users found to test.")
            
        # 2. Find a Guest Phone
        cur.execute("SELECT mobile_number FROM prescriptions WHERE user_id IS NULL LIMIT 1")
        g_row = cur.fetchone()
        
        if g_row:
            phone = g_row[0]
            print(f"\nTesting Guest Phone: {phone}")
            response, status = get_patient_history(phone)
            print(f"Status: {status}")
            print("Response Keys:", response.json.keys())
            print("Prescriptions Count:", len(response.json['prescriptions']))
        else:
            print("\nNo guest prescriptions found to test.")
            
        conn.close()

if __name__ == "__main__":
    try:
        test_backend_function()
    except Exception as e:
        print(f"Test crashed: {e}")
