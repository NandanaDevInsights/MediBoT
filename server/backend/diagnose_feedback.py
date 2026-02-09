import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def check_admin_and_feedback():
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        print("--- Lab Admin Profiles ---")
        cur.execute("SELECT user_id, lab_id, lab_name FROM lab_admin_profile")
        admins = cur.fetchall()
        for a in admins:
            print(f"User ID: {a[0]}, Lab ID: {a[1]}, Name: {a[2]}")
            
        print("\n--- Available Feedback ---")
        cur.execute("SELECT lab_id, lab_name, patient_name, rating FROM lab_feedback")
        feedbacks = cur.fetchall()
        for f in feedbacks:
            print(f"Lab ID: {f[0]}, Lab Name: {f[1]}, Patient: {f[2]}, Rating: {f[3]}")
            
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_admin_and_feedback()
