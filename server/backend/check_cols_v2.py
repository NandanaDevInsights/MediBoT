import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def check_cols():
    conn = get_connection()
    try:
        cur = conn.cursor()
        for table in ['bookings', 'appointments']:
            cur.execute(f"SHOW COLUMNS FROM {table}")
            cols = [c[0] for c in cur.fetchall()]
            print(f"Table: {table} | Cols: {cols}")
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_cols()
