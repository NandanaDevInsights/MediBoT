import mysql.connector
from db_connect import get_connection

def check_schema():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DESCRIBE lab_staff")
    columns = cur.fetchall()
    print("Columns in lab_staff:")
    for col in columns:
        print(col)
    conn.close()

if __name__ == "__main__":
    check_schema()
