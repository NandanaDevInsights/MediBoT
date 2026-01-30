from db_connect import get_connection

def ensure_super_admin_profile():
    email = "medibot.care@gmail.com"
    conn = get_connection()
    cur = conn.cursor()
    
    # Get user id
    cur.execute("SELECT id FROM users WHERE email=%s", (email,))
    row = cur.fetchone()
    if not row:
        print("Super admin user not found.")
        conn.close()
        return
        
    user_id = row[0]
    
    # Check if profile exists
    cur.execute("SELECT 1 FROM user_profiles WHERE user_id=%s", (user_id,))
    if not cur.fetchone():
        cur.execute("""
            INSERT INTO user_profiles (user_id, display_name, contact_number, address) 
            VALUES (%s, %s, %s, %s)
        """, (user_id, "Super Admin", "+91 999 555-ADMIN", "HQ Bangalore, India"))
        print("Created Super Admin profile entry.")
        
    # Check if lab admin profile exists
    cur.execute("SELECT 1 FROM lab_admin_profile WHERE user_id=%s", (user_id,))
    if not cur.fetchone():
        cur.execute("""
            INSERT INTO lab_admin_profile (user_id, lab_name, address, contact_number, admin_name) 
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, "MediBot Central HQ", "Bangalore, India", "+91 999 555-ADMIN", "Chief Administrator"))
        print("Created Lab Admin profile entry for Super Admin.")
        
    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    ensure_super_admin_profile()
