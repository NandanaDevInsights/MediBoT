import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def update_james():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        username = "James"
        email = "keerthanapramod55@gmail.com"
        new_password = "James@123"
        
        # Hash the password
        hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
        
        # Check if user exists
        cur.execute("SELECT id FROM users WHERE username=%s OR email=%s", (username, email))
        user = cur.fetchone()
        
        if user:
            # Update user Role to LAB_ADMIN and set Password
            cur.execute("""
                UPDATE users 
                SET password_hash=%s, role='LAB_ADMIN' 
                WHERE id=%s
            """, (hashed, user[0]))
            print(f"SUCCESS: User {username} ({email}) updated to LAB_ADMIN with password '{new_password}'.")
        else:
            # Create user if not exists (unlikely given previous logs)
            cur.execute("""
                INSERT INTO users (email, username, password_hash, provider, role) 
                VALUES (%s, %s, %s, 'password', 'LAB_ADMIN')
            """, (email, username, hashed))
            print(f"SUCCESS: New admin user '{username}' created with password '{new_password}'.")
        
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    update_james()
