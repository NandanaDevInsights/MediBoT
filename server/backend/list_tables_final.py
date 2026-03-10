import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def list_tables():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "127.0.0.1"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD"),
        database=os.environ.get("DB_NAME")
    )
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    for (table_name,) in cursor.fetchall():
        print(table_name)
    conn.close()

if __name__ == "__main__":
    list_tables()
