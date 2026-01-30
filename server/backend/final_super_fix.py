import bcrypt
from db_connect import get_connection

def super_fix():
    email = "medibot.care@gmail.com"
    target_role = "SUPER_ADMIN"
    password = "Admin@123"
    
    conn = get_connection()
    cur = conn.cursor()
    
    # 1. Ensure in users table
    cur.execute("SELECT id FROM users WHERE email=%s", (email,))
    user_exists = cur.fetchone()
    
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
    
    if user_exists:
        cur.execute("""
            UPDATE users 
            SET role=%s, provider=%s, password_hash=%s, username=%s 
            WHERE id=%s
        """, (target_role, "password", password_hash, "superadmin", user_exists[0]))
        uid = user_exists[0]
        print(f"Updated user ID {uid} to SUPER_ADMIN")
    else:
        cur.execute("""
            INSERT INTO users (email, username, password_hash, provider, role) 
            VALUES (%s, %s, %s, %s, %s)
        """, (email, "superadmin", password_hash, "password", target_role))
        uid = cur.lastrowid
        print(f"Created new SUPER_ADMIN with ID {uid}")
        
    # 2. Ensure in lab_admin_users (whitelist)
    cur.execute("SELECT 1 FROM lab_admin_users WHERE email=%s", (email,))
    if not cur.fetchone():
        cur.execute("INSERT INTO lab_admin_users (email) VALUES (%s)", (email,))
        print("Added to lab_admin_users whitelist")
        
    # 3. Ensure profiles exist
    cur.execute("SELECT 1 FROM user_profiles WHERE user_id=%s", (uid,))
    if not cur.fetchone():
        cur.execute("""
            INSERT INTO user_profiles (user_id, display_name, contact_number, address) 
            VALUES (%s, %s, %s, %s)
        """, (uid, "Super Admin", "+91 999 555-ADMIN", "HQ Bangalore, India"))
        print("Created user_profile")
        
    cur.execute("SELECT 1 FROM lab_admin_profile WHERE user_id=%s", (uid,))
    if not cur.fetchone():
        cur.execute("""
            INSERT INTO lab_admin_profile (user_id, lab_name, address, contact_number, admin_name) 
            VALUES (%s, %s, %s, %s, %s)
        """, (uid, "MediBot Central HQ", "Bangalore, India", "+91 999 555-ADMIN", "Chief Administrator"))
        print("Created lab_admin_profile")
        
    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    super_fix()
