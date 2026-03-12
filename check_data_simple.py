import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def check_data():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM lab_feedback LIMIT 1")
        print(cur.fetchone())
        cur.close()
    finally:
        conn.close()

if __name__ == "__main__":
    check_data()
