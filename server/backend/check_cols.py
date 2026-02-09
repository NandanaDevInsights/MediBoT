import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def check_cols():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SHOW COLUMNS FROM lab_feedback")
        columns = [col[0] for col in cur.fetchall()]
        print(f"Columns: {columns}")
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_cols()
