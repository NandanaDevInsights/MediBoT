"""
Final comprehensive fix for login issues
This will ensure all database records are correct and login works properly
"""

import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def get_connection():
    return mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot_final")
    )

print("\n" + "=" * 100)
print("FINAL LOGIN FIX - Ensuring all users have proper usernames")
print("=" * 100)

conn = get_connection()
cur = conn.cursor()

# Check for users without usernames
print("\n1. Checking for users with NULL or empty usernames...")
cur.execute("SELECT id, email, username, role FROM users WHERE username IS NULL OR username = ''")
broken_users = cur.fetchall()

if broken_users:
    print(f"   Found {len(broken_users)} users with missing usernames:")
    for user in broken_users:
        print(f"   - ID: {user[0]}, Email: {user[1]}, Username: {user[2]}, Role: {user[3]}")
    
    print("\n   Fixing usernames...")
    for user in broken_users:
        user_id, email, _, role = user
        # Generate username from email
        new_username = email.split('@')[0]
        
        # Check if username already exists
        cur.execute("SELECT 1 FROM users WHERE username=%s AND id!=%s", (new_username, user_id))
        if cur.fetchone():
            # Append ID to make it unique
            new_username = f"{new_username}_{user_id}"
        
        cur.execute("UPDATE users SET username=%s WHERE id=%s", (new_username, user_id))
        print(f"   [DONE] Fixed: ID {user_id} -> Username: {new_username}")
    
    conn.commit()
else:
    print("   [DONE] All users have usernames!")

# Verify all password-based users
print("\n2. Verifying all password-based login users...")
cur.execute("""
    SELECT id, email, username, role, 
           CASE WHEN password_hash IS NOT NULL THEN 'YES' ELSE 'NO' END as has_password
    FROM users 
    WHERE provider = 'password'
    ORDER BY role, email
""")

users = cur.fetchall()
print(f"   Found {len(users)} password-based users:")
print("   " + "-" * 96)
for user in users:
    print(f"   ID: {user[0]:3} | Email: {user[1]:30} | Username: {user[2]:15} | Role: {user[3]:12} | PWD: {user[4]}")
print("   " + "-" * 96)

# Ensure we have test users
print("\n3. Ensuring test users exist with known credentials...")

test_users = [
    ('patient@example.com', 'patient', 'Patient@123', 'USER'),
    ('admin@example.com', 'admin', 'Admin@123', 'LAB_ADMIN'),
    ('user@test.com', 'testuser', 'Test@123', 'USER'),
]

for email, username, password, role in test_users:
    # Check if user exists
    cur.execute("SELECT id, username FROM users WHERE email=%s", (email,))
    existing = cur.fetchone()
    
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
    
    if existing:
        user_id, existing_username = existing
        if existing_username != username:
            print(f"   Updating {email}: username '{existing_username}' -> '{username}'")
            cur.execute("UPDATE users SET username=%s, password_hash=%s WHERE id=%s", 
                       (username, password_hash, user_id))
        else:
            print(f"   Updating password for {email}")
            cur.execute("UPDATE users SET password_hash=%s WHERE id=%s", 
                       (password_hash, user_id))
    else:
        print(f"   Creating new user: {email}")
        cur.execute("""
            INSERT INTO users (email, username, password_hash, role, provider)
            VALUES (%s, %s, %s, %s, 'password')
        """, (email, username, password_hash, role))
    
    # Ensure LAB_ADMIN is whitelisted
    if role == 'LAB_ADMIN':
        cur.execute("INSERT IGNORE INTO lab_admin_users (email) VALUES (%s)", (email,))

conn.commit()
print("   [DONE] Test users verified!")

# Final verification
print("\n4. Final verification - All users:")
cur.execute("""
    SELECT id, email, username, role, provider,
           CASE WHEN password_hash IS NOT NULL THEN 'YES' ELSE 'NO' END as has_password
    FROM users 
    ORDER BY role, email
""")

all_users = cur.fetchall()
print("   " + "=" * 96)
for user in all_users:
    print(f"   ID: {user[0]:3} | {user[1]:30} | {user[2]:15} | {user[3]:12} | {user[4]:10} | PWD: {user[5]}")
print("   " + "=" * 96)

cur.close()
conn.close()

print("\n" + "=" * 100)
print("AVAILABLE TEST CREDENTIALS")
print("=" * 100)
print("\nRegular User:")
print("  Email: patient@example.com  OR  Username: patient")
print("  Password: Patient@123")
print("\nLab Admin:")
print("  Email: admin@example.com  OR  Username: admin")
print("  Password: Admin@123")
print("\nTest User:")
print("  Email: user@test.com  OR  Username: testuser")
print("  Password: Test@123")
print("\n" + "=" * 100)
print("[DONE] LOGIN FIX COMPLETED SUCCESSFULLY!")
print("=" * 100 + "\n")
