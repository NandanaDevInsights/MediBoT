
import requests
import json

# We can't easily simulate the session here without logging in first.
# But we can check the app.py to see if there's a dev mode or similar.
# Actually, I'll just write a script that runs INSIDE the flask context if possible.
# Or just run another debug script that uses the same DB and logic.

# I already did that with test_endpoint_debug.py and it worked.
# It returned 8 rows.

# So the backend is definitely returning 8 rows.
# The frontend MUST be receiving 8 rows.

# THEN WHY IS IT FILTERING TO 0?

import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

conn = mysql.connector.connect(
    host=os.environ.get("DB_HOST", "localhost"),
    user=os.environ.get("DB_USER", "root"),
    password=os.environ.get("DB_PASSWORD", ""),
    database=os.environ.get("DB_NAME", "medibot")
)
cur = conn.cursor(dictionary=True)
cur.execute("SELECT * FROM appointments")
rows = cur.fetchall()
for r in rows:
    print(f"LAB: '{r['lab_name']}' | LOC: '{r['location']}'")
conn.close()
