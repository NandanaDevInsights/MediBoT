
import os
import mysql.connector
from dotenv import load_dotenv
import bcrypt

load_dotenv()

def create_dummy_patient():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        # Check if dummy patient exists
        cur.execute("SELECT id FROM users WHERE email='patient@example.com'")
        existing = cur.fetchone()
        
        if not existing:
            print("Creating dummy patient...")
            # Hash 'Password@123'
            pw_hash = bcrypt.hashpw('Password@123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            cur.execute(
                "INSERT INTO users (email, password_hash, role) VALUES (%s, %s, %s)",
                ('patient@example.com', pw_hash, 'USER')
            )
            user_id = cur.lastrowid
            conn.commit()
            print(f"Created patient with ID: {user_id}")
        else:
            print("Dummy patient already exists.")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_dummy_patient()
