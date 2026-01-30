from db_connect import get_connection

def check_prescriptions_columns():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SHOW COLUMNS FROM prescriptions")
        cols = cur.fetchall()
        print("Columns in 'prescriptions' table:")
        for col in cols:
            print(f"- {col[0]} ({col[1]})")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_prescriptions_columns()
