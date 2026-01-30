import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def reset_nandana_password():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor()
    
    email = "47.nandanapramod@gmail.com"
    new_password = "admin123"
    
    hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
    
    cur.execute("UPDATE users SET password_hash=%s, role='LAB_ADMIN' WHERE email=%s", (hashed, email))
    print(f"Password for {email} reset to {new_password}")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    reset_nandana_password()
