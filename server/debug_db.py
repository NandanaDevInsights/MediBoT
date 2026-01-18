
import mysql.connector
from backend.app import get_connection

def inspect_db():
    conn = get_connection()
    cur = conn.cursor()

    print("--- Laboratories ---")
    cur.execute("SELECT id, name, latitude, longitude FROM laboratories")
    for row in cur.fetchall():
        print(row)

    print("\n--- Appointments ---")
    cur.execute("SELECT id, lab_id, lab_name FROM appointments ORDER BY id DESC LIMIT 5")
    for row in cur.fetchall():
        print(row)
    
    conn.close()

if __name__ == "__main__":
    inspect_db()
