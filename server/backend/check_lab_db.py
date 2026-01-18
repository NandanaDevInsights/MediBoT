
import mysql.connector
import os

def check_db():
    try:
        conn = mysql.connector.connect(
            host="127.0.0.1",
            user="root",
            password="",
            database="medibot",
            port=3306
        )
        cur = conn.cursor()

        print("--- Tables ---")
        cur.execute("SHOW TABLES")
        for t in cur.fetchall():
            print(t)

        print("\n--- Laboratories Schema ---")
        try:
            cur.execute("DESCRIBE laboratories")
            for col in cur.fetchall():
                print(col)
        except Exception as e:
            print(f"Laboratories table error: {e}")

        print("\n--- Appointments Schema ---")
        try:
            cur.execute("DESCRIBE appointments")
            for col in cur.fetchall():
                print(col)
        except Exception as e:
            print(f"Appointments table error: {e}")

        print("\n--- Laboratories Data ---")
        try:
             cur.execute("SELECT * FROM laboratories")
             for r in cur.fetchall():
                 print(r)
        except: pass
            
        cur.close()
        conn.close()

    except Exception as e:
        print(f"Error checking DB: {e}")

if __name__ == "__main__":
    check_db()
