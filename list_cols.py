import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def check_columns():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SHOW COLUMNS FROM lab_feedback")
        cols = [col[0] for col in cur.fetchall()]
        print("Column names:", ", ".join(cols))
        cur.close()
    finally:
        conn.close()

if __name__ == "__main__":
    check_columns()
