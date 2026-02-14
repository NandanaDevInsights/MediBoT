
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def check_otp_schema():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor()
    try:
        cur.execute("SHOW CREATE TABLE user_otps")
        print(cur.fetchone()[1])
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_otp_schema()
