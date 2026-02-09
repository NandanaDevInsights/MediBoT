import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def check_medivison():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM lab_feedback WHERE lab_name = 'Medivison'")
        count = cur.fetchone()[0]
        print(f"Medivison feedback count: {count}")
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_medivison()
