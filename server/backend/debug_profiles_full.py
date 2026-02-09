import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def debug_data():
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        print("--- Lab Admin Profiles (FULL) ---")
        cur.execute("SELECT user_id, lab_name FROM lab_admin_profile")
        admins = cur.fetchall()
        for a in admins:
            print(f"UID: {a[0]} | Name: '{a[1]}'")
            
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    debug_data()
