
from app import ensure_lab_staff_table, get_connection
print("Running ensure_lab_staff_table...")
ensure_lab_staff_table()
print("Done.")

# Verify schema
conn = get_connection()
cur = conn.cursor()
cur.execute("DESCRIBE lab_staff")
print("Columns:")
for row in cur.fetchall():
    print(row[0])
conn.close()
