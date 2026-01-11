
import mysql.connector
import os
import requests

def test_sql():
    print("Testing SQL...")
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="medibot"
        )
        cur = conn.cursor()
        query = """
            SELECT 
                u.id, 
                u.email, 
                u.email, 
                (SELECT mobile_number FROM prescriptions p WHERE p.user_id = u.id ORDER BY created_at DESC LIMIT 1) as phone,
                (SELECT COUNT(*) FROM prescriptions p WHERE p.user_id = u.id) as upload_count,
                (SELECT file_path FROM prescriptions p WHERE p.user_id = u.id ORDER BY created_at DESC LIMIT 1) as latest_rx
            FROM users u
            WHERE u.role NOT IN ('LAB_ADMIN', 'SUPER_ADMIN')
        """
        cur.execute(query)
        rows = cur.fetchall()
        print(f"SQL Success. Rows found: {len(rows)}")
        for r in rows:
            print(r)
        conn.close()
    except Exception as e:
        print(f"SQL Failed: {e}")

def test_endpoint():
    print("\nTesting Endpoint...")
    try:
        # We need to simulate a login to get a cookie, or we bypass?
        # The endpoint checks session role.
        # We can't easily test endpoint without session cookie.
        # But we can check if it returns 404 (endpoint not found) or 403 (unauthorized) or 500.
        # If 404, server not reloaded (since we just added it).
        
        response = requests.get('http://localhost:5000/api/admin/patients')
        print(f"Status Code: {response.status_code}")
        # We expect 403 if it works but we are not logged in.
        # We expect 404 if the server code is old.
        # We expect 500 if server code is new but buggy (and fails before role check? Unlikely, role check is first).
        
    except Exception as e:
        print(f"Endpoint Request Failed: {e}")

if __name__ == "__main__":
    test_sql()
    test_endpoint()
