
import os
import mysql.connector
import json
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def check_users_schema():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor()
    cur.execute("DESCRIBE users")
    cols = cur.fetchall()
    
    cur.execute("SELECT * FROM users LIMIT 1")
    sample = cur.fetchone()
    
    result = {
        "columns": [c[0] for c in cols],
        "sample": sample
    }
    
    with open("schema_debug.json", "w") as f:
        json.dump(result, f, indent=2, default=str)
    
    conn.close()

if __name__ == "__main__":
    check_users_schema()
