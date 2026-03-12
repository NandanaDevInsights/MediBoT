import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def scan_for_feedback():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SHOW TABLES")
        tables = [r[0] for r in cur.fetchall()]
        results = []
        for table in tables:
            cur.execute(f"DESCRIBE {table}")
            cols = cur.fetchall()
            for col in cols:
                col_name = col[0].lower()
                if 'rating' in col_name or 'feedback' in col_name or 'review' in col_name or 'comment' in col_name:
                    results.append(f"Table: {table}, Column: {col[0]}")
        
        print("\n".join(results) if results else "No columns found.")
        cur.close()
    finally:
        conn.close()

if __name__ == "__main__":
    scan_for_feedback()
