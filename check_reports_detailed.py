import os
import sys
import json

# Add server/backend to sys.path to import db_connect
sys.path.append(os.path.abspath('server/backend'))

from db_connect import get_connection

def check_reports():
    try:
        conn = get_connection()
        cur = conn.cursor(dictionary=True)
        
        print("\n--- REPORTS DATA ---")
        cur.execute("SELECT id, patient_id, file_path, test_name, status, uploaded_at FROM reports")
        reports = cur.fetchall()
        for r in reports:
            print(f"ID: {r['id']}, PatientID: {r['patient_id']}, Test: {r['test_name']}, Path: {r['file_path']}")
            
        print("\n--- USERS DATA ---")
        cur.execute("SELECT id, username, email FROM users")
        users = cur.fetchall()
        for u in users:
            print(f"ID: {u['id']}, Username: {u['username']}, Email: {u['email']}")

        cur.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    check_reports()
