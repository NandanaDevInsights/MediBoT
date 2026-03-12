import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def get_schema():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("DESCRIBE lab_feedback")
        columns = cur.fetchall()
        for col in columns:
            print(col)
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    get_schema()
