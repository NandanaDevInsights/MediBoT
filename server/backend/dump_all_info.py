import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def dump_all():
    conn = get_connection()
    try:
        cur = conn.cursor()
        print("--- USERS ---")
        cur.execute("SELECT id, username, role FROM users")
        for r in cur.fetchall():
            print(r)
            
        print("\n--- LAB ADMIN PROFILE ---")
        cur.execute("SELECT user_id, lab_id, lab_name FROM lab_admin_profile")
        for r in cur.fetchall():
            print(r)
            
        print("\n--- LAB FEEDBACK ---")
        cur.execute("SELECT id, lab_id, lab_name, patient_name, rating, comment FROM lab_feedback")
        for r in cur.fetchall():
            print(r)
            
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    dump_all()
