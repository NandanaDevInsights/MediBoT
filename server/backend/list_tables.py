import mysql.connector
from db_connect import get_connection

def check_tables():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SHOW TABLES")
        print("TABLES IN DB:")
        for (table,) in cur.fetchall():
            print(table)
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_tables()
