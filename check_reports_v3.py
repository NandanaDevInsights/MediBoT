import os
import sys

# Add server/backend to sys.path to import db_connect
sys.path.append(os.path.abspath('server/backend'))

try:
    from db_connect import get_connection
except ImportError as e:
    print(f"ImportError: {e}")
    sys.exit(1)

def check_reports():
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        print("\n--- reports table structure ---")
        cur.execute("DESCRIBE reports")
        for col in cur.fetchall():
            print(col)
            
        print("\n--- reports table data (first 10) ---")
        cur.execute("SELECT id, patient_id, file_path, test_name, status, uploaded_at FROM reports LIMIT 10")
        for row in cur.fetchall():
            print(row)
            
        print("\n--- users table data (first 5) ---")
        cur.execute("SELECT id, username, email FROM users LIMIT 5")
        for row in cur.fetchall():
            print(row)

        cur.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    check_reports()
