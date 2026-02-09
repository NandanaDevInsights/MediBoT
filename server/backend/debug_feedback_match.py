import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def debug_data():
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        print("--- Lab Admin Profiles ---")
        cur.execute("SELECT user_id, lab_id, lab_name FROM lab_admin_profile")
        admins = cur.fetchall()
        for a in admins:
            print(f"User ID: {a[0]}, Lab ID: {a[1]}, Name: '{a[2]}'")
            
        print("\n--- Lab Feedback ---")
        cur.execute("SELECT DISTINCT lab_name FROM lab_feedback")
        feedbacks = cur.fetchall()
        for f in feedbacks:
            print(f"Feedback for Lab Name: '{f[0]}'")
            
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    debug_data()
