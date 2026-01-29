from db_connect import get_connection

conn = get_connection()
cur = conn.cursor()
cur.execute('SHOW COLUMNS FROM lab_staff')
cols = cur.fetchall()
with open('cols.txt', 'w') as f:
    for c in cols:
        f.write(f"{c[0]}\n")
print("Wrote columns to cols.txt")
conn.close()
