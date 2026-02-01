"""
Enhanced login query to handle case-insensitive matching
This script will update the database to ensure proper collation
"""

import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

conn = mysql.connector.connect(
    host=os.environ.get("DB_HOST", "localhost"),
    user=os.environ.get("DB_USER", "root"),
    password=os.environ.get("DB_PASSWORD", ""),
    database=os.environ.get("DB_NAME", "medibot_final")
)

cur = conn.cursor()

print("\n" + "=" * 80)
print("CHECKING DATABASE COLLATION")
print("=" * 80)

# Check current collation for email and username columns
cur.execute("""
    SELECT COLUMN_NAME, COLUMN_TYPE, COLLATION_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = %s 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME IN ('email', 'username')
""", (os.environ.get("DB_NAME", "medibot_final"),))

columns = cur.fetchall()
print("\nCurrent column settings:")
for col in columns:
    print(f"  {col[0]}: {col[1]} (Collation: {col[2]})")

# Test case sensitivity
print("\n" + "=" * 80)
print("TESTING CASE SENSITIVITY")
print("=" * 80)

test_queries = [
    ("Exact match", "SELECT id, email, username FROM users WHERE email='patient@example.com' LIMIT 1"),
    ("Upper case", "SELECT id, email, username FROM users WHERE email='PATIENT@EXAMPLE.COM' LIMIT 1"),
    ("Mixed case", "SELECT id, email, username FROM users WHERE email='Patient@Example.Com' LIMIT 1"),
]

for name, query in test_queries:
    cur.execute(query)
    result = cur.fetchone()
    if result:
        print(f"  ✓ {name}: Found user (ID: {result[0]}, Email: {result[1]}, Username: {result[2]})")
    else:
        print(f"  ✗ {name}: Not found")

cur.close()
conn.close()

print("\n" + "=" * 80)
print("\nNote: If case-sensitive queries fail, the collation might need to be adjusted.")
print("Most MySQL installations use case-insensitive collation by default (utf8mb4_general_ci).")
print("=" * 80 + "\n")
