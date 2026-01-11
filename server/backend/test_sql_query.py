
import os
import mysql.connector
from dotenv import load_dotenv
import json

load_dotenv()

def test_query():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor(dictionary=True)
        
        query = """
            SELECT 
                u.id, 
                u.email, 
                u.created_at,
                (SELECT COUNT(*) FROM prescriptions p WHERE p.user_id = u.id OR p.user_id IS NULL) as reports_count,
                (SELECT mobile_number FROM prescriptions p WHERE (p.user_id = u.id OR p.user_id IS NULL) AND mobile_number IS NOT NULL ORDER BY created_at DESC LIMIT 1) as phone,
                (SELECT file_path FROM prescriptions p WHERE (p.user_id = u.id OR p.user_id IS NULL) ORDER BY created_at DESC LIMIT 1) as latest_rx
            FROM users u 
            WHERE u.role='USER'
        """
        
        print("Executing query...")
        cur.execute(query)
        rows = cur.fetchall()
        print(json.dumps(rows, indent=2, default=str))
        conn.close()
    except Exception as e:
        print(f"SQL Error: {e}")

if __name__ == "__main__":
    test_query()
