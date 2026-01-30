import bcrypt
from db_connect import get_connection

def seed_super_admin():
    email = "medibot.care@gmail.com"
    username = "superadmin"
    password = "Admin@123"
    role = "SUPER_ADMIN"
    
    conn = get_connection()
    cur = conn.cursor()
    
    # Check if user exists
    cur.execute("SELECT id FROM users WHERE email=%s", (email,))
    existing = cur.fetchone()
    
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
    
    if existing:
        # Update existing user to SUPER_ADMIN
        cur.execute("UPDATE users SET role=%s, provider=%s, password_hash=%s WHERE id=%s", (role, "password", password_hash, existing[0]))
        print(f"Updated existing user {email} to SUPER_ADMIN")
    else:
        # Insert new super admin
        cur.execute(
            "INSERT INTO users (email, username, password_hash, provider, role) VALUES (%s, %s, %s, %s, %s)",
            (email, username, password_hash, "password", role)
        )
        print(f"Created new SUPER_ADMIN: {email}")
        
    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    seed_super_admin()
