import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def check_everything():
    conn = get_connection()
    try:
        cur = conn.cursor()
        print("--- Tables ---")
        cur.execute("SHOW TABLES")
        tables = [r[0] for r in cur.fetchall()]
        for table in tables:
            print(f"\n--- Table: {table} ---")
            cur.execute(f"DESCRIBE {table}")
            for col in cur.fetchall():
                print(col)
                if 'rating' in col[0].lower() or 'feedback' in col[0].lower() or 'review' in col[0].lower():
                    print(f"!!! FOUND POSSIBLE FEEDBACK COLUMN IN {table}: {col[0]}")
            
        cur.close()
    finally:
        conn.close()

if __name__ == "__main__":
    check_everything()
