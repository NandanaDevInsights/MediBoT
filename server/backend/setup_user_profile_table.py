
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def create_table():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("Creating user_profile table (singular)...")
        # Match the schema of user_profiles but singular name
        cur.execute("""
            CREATE TABLE IF NOT EXISTS user_profile (
                user_id INT PRIMARY KEY,
                display_name VARCHAR(100),
                age INT,
                gender VARCHAR(20),
                blood_group VARCHAR(10),
                contact_number VARCHAR(20),
                address TEXT,
                profile_pic_url TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        print("Table user_profile created.")
        
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_table()
