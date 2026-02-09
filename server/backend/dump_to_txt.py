import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def dump_to_txt():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM lab_feedback")
        rows = cur.fetchall()
        with open('lab_feedback_dump.txt', 'w') as f:
            for r in rows:
                f.write(str(r) + '\n')
        cur.close()
        print(f"Dumped {len(rows)} rows to lab_feedback_dump.txt")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    dump_to_txt()
