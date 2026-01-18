
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def setup_db():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        # Create lab_admin_profile table
        print("Creating lab_admin_profile table...")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS lab_admin_profile (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                lab_name VARCHAR(255),
                address TEXT,
                contact_number VARCHAR(50),
                admin_name VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        # Optional: Add username to users if missing? 
        # But assuming users exists and has username.
        
        conn.commit()
        cur.close()
        conn.close()
        print("Table created successfully.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    setup_db()
