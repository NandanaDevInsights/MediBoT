import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def cleanup_names():
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Trim names in lab_admin_profile
        print("Trimming lab_admin_profile.lab_name...")
        cur.execute("UPDATE lab_admin_profile SET lab_name = TRIM(lab_name)")
        
        # Trim names in lab_feedback
        print("Trimming lab_feedback.lab_name...")
        cur.execute("UPDATE lab_feedback SET lab_name = TRIM(lab_name)")
        
        conn.commit()
        print("✅ Cleanup complete.")
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    cleanup_names()
