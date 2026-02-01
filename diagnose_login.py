import mysql.connector
import bcrypt
from dotenv import load_dotenv
import os

load_dotenv('server/backend/.env')

try:
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='medibot_final'
    )
    
    cur = conn.cursor()
    
    # First, let's check what users exist
    cur.execute('SELECT id, email, username, role, provider, password_hash FROM users LIMIT 10')
    
    print('=' * 100)
    print('USERS IN DATABASE:')
    print('=' * 100)
    users = cur.fetchall()
    for row in users:
        print(f"ID: {row[0]}")
        print(f"  Email: {row[1]}")
        print(f"  Username: {row[2]}")
        print(f"  Role: {row[3]}")
        print(f"  Provider: {row[4]}")
        print(f"  Has Password Hash: {bool(row[5])}")
        print('-' * 100)
    
    # Now let's test the login query logic
    print('\n' + '=' * 100)
    print('TESTING LOGIN QUERIES:')
    print('=' * 100)
    
    test_identifiers = ['admin@example.com', 'patient@example.com', 'testuser', 'test_admin_reset@lab.com']
    
    for identifier in test_identifiers:
        print(f"\nTesting identifier: '{identifier}'")
        
        # Simulate the get_user_with_password function
        if '@' in identifier:
            query = "SELECT id, email, password_hash, provider, role, pin_code, username FROM users WHERE email=%s LIMIT 1"
        else:
            query = "SELECT id, email, password_hash, provider, role, pin_code, username FROM users WHERE username=%s LIMIT 1"
        
        cur.execute(query, (identifier,))
        result = cur.fetchone()
        
        if result:
            print(f"  ✓ User FOUND: ID={result[0]}, Email={result[1]}, Username={result[6]}, Role={result[4]}")
        else:
            print(f"  ✗ User NOT FOUND")
    
    cur.close()
    conn.close()
    print('\n' + '=' * 100)
    print('Database check completed successfully.')
    print('=' * 100)
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
