import mysql.connector
from db_connect import get_connection

def check():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DESCRIBE prescriptions")
    for row in cur.fetchall():
        print(row)
    cur.execute("SHOW CREATE TABLE prescriptions")
    print(cur.fetchone()[1])
    conn.close()

if __name__ == "__main__":
    check()
