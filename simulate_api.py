import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def simulate_fetch(user_id):
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT lab_id, lab_name FROM lab_admin_profile WHERE user_id=%s", (user_id,))
        profile = cur.fetchone()
        if not profile:
            print("No profile")
            return
            
        lab_id, lab_name = profile
        print(f"Profile: lab_id={lab_id}, lab_name='{lab_name}'")
        
        cur.execute("""
            SELECT id, patient_name, rating, comment, category, created_at
            FROM lab_feedback
            WHERE (lab_id IS NOT NULL AND lab_id != 0 AND lab_id = %s) 
               OR (TRIM(lab_name) = TRIM(%s))
               OR (lab_name LIKE CONCAT('%%', %s, '%%'))
               OR (%s LIKE CONCAT('%%', lab_name, '%%'))
            ORDER BY created_at DESC
        """, (lab_id, lab_name, lab_name, lab_name))
        
        rows = cur.fetchall()
        print(f"Found {len(rows)} entries")
        for r in rows:
            print(r)
        cur.close()
    finally:
        conn.close()

if __name__ == "__main__":
    # Test for user 6 (Test Lab) and user 2 (Royal Clinical)
    print("--- User 6 ---")
    simulate_fetch(6)
    print("\n--- User 2 ---")
    simulate_fetch(2)
