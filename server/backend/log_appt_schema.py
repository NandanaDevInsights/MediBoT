
from db_connect import get_connection
conn = get_connection()
cur = conn.cursor()
cur.execute("DESCRIBE appointments")
with open('appt_cols.txt', 'w') as f:
    for row in cur.fetchall():
        f.write(str(row) + '\n')
conn.close()
