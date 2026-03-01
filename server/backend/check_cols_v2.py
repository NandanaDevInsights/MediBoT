from db_connect import get_connection

def get_columns():
    conn = get_connection()
    cur = conn.cursor()
    
    for table in ['bookings', 'laboratories', 'appointments']:
        cur.execute(f"SHOW COLUMNS FROM {table}")
        cols = [r[0] for r in cur.fetchall()]
        print(f"--- {table} ---")
        for c in cols:
            print(c)
    
    conn.close()

if __name__ == "__main__":
    get_columns()
