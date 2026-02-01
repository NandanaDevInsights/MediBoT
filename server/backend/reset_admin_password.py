
import mysql.connector
from db_connect import get_connection
import bcrypt

def reset_password():
    conn = get_connection()
    cur = conn.cursor()
    
    email = "medibot.care@gmail.com"
    password = "Admin@123"
    
    # Generate hash
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    print(f"Resetting password for {email} to {password}")
    
    cur.execute("UPDATE users SET password_hash=%s WHERE email=%s", (hashed, email))
    conn.commit()
    
    if cur.rowcount > 0:
        print("Password updated successfully.")
    else:
        print("User not found or no change.")
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    reset_password()
