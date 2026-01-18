import os
import mysql.connector
from dotenv import load_dotenv
import traceback

load_dotenv()

host = os.environ.get("DB_HOST")
user = os.environ.get("DB_USER")
password = os.environ.get("DB_PASSWORD", "")

print(f"Attempting connection to HOST: '{host}', USER: '{user}'")

try:
    conn = mysql.connector.connect(
        host=host,
        user=user,
        password=password
    )
    print("SUCCESS: Connected to database.")
    conn.close()
except Exception as e:
    print("FAILURE: Could not connect.")
    print(e)
