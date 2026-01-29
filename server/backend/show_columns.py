"""
Simple column check
"""
import sys
sys.path.append('.')
from db_connect import get_connection

conn = get_connection()
cur = conn.cursor()

cur.execute("SHOW COLUMNS FROM lab_staff")
results = cur.fetchall()

print("Columns in lab_staff table:")
print("-" * 60)
for row in results:
    print(f"Column: {row[0]:<25} Type: {row[1]}")
print("-" * 60)

cur.close()
conn.close()
