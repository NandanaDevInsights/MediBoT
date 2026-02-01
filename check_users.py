import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

try:
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='medibot_final'
    )
    
    cur = conn.cursor()
    cur.execute('SELECT id, email, username, role, provider FROM users LIMIT 10')
    
    print('Users in database:')
    print('-' * 80)
    for row in cur.fetchall():
        print(f"ID: {row[0]}, Email: {row[1]}, Username: {row[2]}, Role: {row[3]}, Provider: {row[4]}")
    
    cur.close()
    conn.close()
    print('\nDatabase query completed successfully.')
    
except Exception as e:
    print(f"Error: {e}")
