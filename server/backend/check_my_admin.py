
import mysql.connector
from db_connect import get_connection
import bcrypt
import sys

def check():
    try:
        conn = get_connection()
        cur = conn.cursor(dictionary=True)
        
        email = "medibot.care@gmail.com"
        print(f"User: {email}")
        
        cur.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cur.fetchone()
        
        if not user:
            print("User NOT found in DB")
            return

        print(f"Role: {user['role']}")
        print(f"Hash: {user['password_hash'][:10]}...") 
        
        password = "Admin@123"
        if user['password_hash']:
            match = bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8'))
            print(f"PwMatch: {match}")
        else:
            print("NoHash")

        # Check if they are in strict super admin check
        if user['role'] == 'SUPER_ADMIN':
            print("Is Super Admin strict check pass: Yes") 
        
    except Exception as e:
        print(e)
    finally:
        if 'cur' in locals(): cur.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    check()
