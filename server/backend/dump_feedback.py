import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def dump_feedback():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT lab_name, patient_name FROM lab_feedback")
        rows = cur.fetchall()
        print(f"Total rows: {len(rows)}")
        for r in rows:
            print(f"Lab: '{r[0]}' | Patient: {r[1]}")
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    dump_feedback()
