from db_connect import get_connection

def check_users():
    conn = get_connection()
    cur = conn.cursor()
    
    print("=== USERS TABLE ===")
    cur.execute("SELECT id, email, username, provider, role FROM users")
    users = cur.fetchall()
    
    if users:
        for user in users:
            print(f"ID: {user[0]}, Email: {user[1]}, Username: {user[2]}, Provider: {user[3]}, Role: {user[4]}")
    else:
        print("No users found in users table")
    
    print("\n=== LAB_ADMIN_USERS TABLE (Whitelist) ===")
    cur.execute("SELECT email FROM lab_admin_users")
    admins = cur.fetchall()
    
    if admins:
        for admin in admins:
            print(f"Whitelisted: {admin[0]}")
    else:
        print("No whitelisted admins")
    
    conn.close()

if __name__ == "__main__":
    check_users()
