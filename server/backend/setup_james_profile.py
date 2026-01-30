import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def create_james_profile():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        # Get James ID
        cur.execute("SELECT id FROM users WHERE username='James'")
        user_row = cur.fetchone()
        
        if user_row:
            user_id = user_row[0]
            # Insert or Update profile
            cur.execute("""
                INSERT INTO lab_admin_profile (user_id, lab_name, admin_name, contact_number, address)
                VALUES (%s, 'James Labs', 'James', '+911234567890', 'Main Street, City')
                ON DUPLICATE KEY UPDATE lab_name='James Labs'
            """, (user_id,))
            conn.commit()
            print("SUCCESS: James profile created/updated.")
        else:
            print("ERROR: James user not found.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    create_james_profile()
