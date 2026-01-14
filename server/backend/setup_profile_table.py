
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def create_profile_table():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cursor = conn.cursor()
    
    print("Creating user_profiles table...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_profiles (
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
    print("Table created (if not existed).")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_profile_table()
