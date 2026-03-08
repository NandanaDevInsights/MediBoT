from app import get_connection

c = get_connection()
cursor = c.cursor(dictionary=True)
cursor.execute('DESCRIBE appointments')
for row in cursor.fetchall():
    print(row['Field'])
c.close()
