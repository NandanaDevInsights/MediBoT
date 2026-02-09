import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def verify_users_and_profiles():
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        print("--- Users Table ---")
        cur.execute("SELECT id, username, role FROM users")
        users = cur.fetchall()
        for u in users:
            uid, name, role = u
            cur.execute("SELECT lab_name FROM lab_admin_profile WHERE user_id=%s", (uid,))
            profile = cur.fetchone()
            profile_name = profile[0] if profile else "NO PROFILE"
            print(f"ID: {uid} | User: {name} | Role: {role} | Profile Lab: {profile_name}")
            
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    verify_users_and_profiles()
