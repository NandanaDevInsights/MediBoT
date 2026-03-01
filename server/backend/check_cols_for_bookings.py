from db_connect import get_connection

def get_columns():
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("SHOW COLUMNS FROM bookings")
    bookings_cols = [r[0] for r in cur.fetchall()]
    
    cur.execute("SHOW COLUMNS FROM laboratories")
    labs_cols = [r[0] for r in cur.fetchall()]
    
    cur.execute("SHOW COLUMNS FROM appointments")
    appts_cols = [r[0] for r in cur.fetchall()]
    
    print("BOOKINGS COLUMNS:")
    print(bookings_cols)
    print("\nLABS COLUMNS:")
    print(labs_cols)
    print("\nAPPOINTMENTS COLUMNS:")
    print(appts_cols)
    
    conn.close()

if __name__ == "__main__":
    get_columns()
