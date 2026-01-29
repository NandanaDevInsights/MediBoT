"""
Write column info to file
"""
import sys
sys.path.append('.')
from db_connect import get_connection

conn = get_connection()
cur = conn.cursor()

cur.execute("SHOW COLUMNS FROM lab_staff")
results = cur.fetchall()

with open('staff_columns.txt', 'w') as f:
    f.write("Columns in lab_staff table:\n")
    f.write("=" * 80 + "\n")
    for row in results:
        f.write(f"{row[0]}\n")
    f.write("=" * 80 + "\n")
    
    # Also get a sample row
    cur.execute("SELECT * FROM lab_staff LIMIT 1")
    sample = cur.fetchone()
    if sample:
        f.write("\nSample row:\n")
        col_names = [row[0] for row in results]
        for col, val in zip(col_names, sample):
            f.write(f"{col}: {val}\n")

print("✅ Column information written to staff_columns.txt")

cur.close()
conn.close()
