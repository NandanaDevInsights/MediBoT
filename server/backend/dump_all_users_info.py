from db_connect import get_connection
import json

def dump_users():
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        
        print("--- USERS TABLE ---")
        cur.execute("SELECT id, email, username, role FROM users")
        users = cur.fetchall()
        for u in users:
            print(u)
            
        print("\n--- LAB_ADMIN_USERS TABLE ---")
        cur.execute("SELECT * FROM lab_admin_users")
        lab_admins = cur.fetchall()
        for la in lab_admins:
            print(la)
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    dump_users()
