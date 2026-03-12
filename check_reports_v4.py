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
        
        with open('reports_debug_v2.txt', 'w', encoding='utf-8') as f:
            f.write("\n--- REPORTS DATA ---\n")
            cur.execute("SELECT id, patient_id, file_path, test_name, status, uploaded_at FROM reports")
            reports = cur.fetchall()
            for r in reports:
                f.write(f"ID: {r['id']}, PatientID: {r['patient_id']}, Test: {r['test_name']}, Path: {r['file_path']}, Status: {r['status']}\n")
                
            f.write("\n--- USERS DATA ---\n")
            cur.execute("SELECT id, username, email FROM users")
            users = cur.fetchall()
            for u in users:
                f.write(f"ID: {u['id']}, Username: {u['username']}, Email: {u['email']}\n")

        cur.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    check_reports()
