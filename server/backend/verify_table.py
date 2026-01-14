from db_connect import get_connection

def check_table():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SHOW TABLES LIKE 'appointments'")
        row = cur.fetchone()
        if row:
            print("Table 'appointments' exists.")
            cur.execute("DESCRIBE appointments")
            cols = cur.fetchall()
            for col in cols:
                print(col)
        else:
            print("Table 'appointments' DOES NOT exist.")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_table()
