"""
Comprehensive Login Fix Script
This script will:
1. Check current users in the database
2. Ensure test users exist with known credentials
3. Test login functionality
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

def fix_logins():
    print("=" * 80)
    print("COMPREHENSIVE LOGIN FIX")
    print("=" * 80)
    
    conn = get_connection()
    cur = conn.cursor()
    
    # Step 1: Check existing users
    print("\n1. Checking existing users...")
    cur.execute("SELECT id, email, username, role, provider FROM users")
    existing_users = cur.fetchall()
    
    if existing_users:
        print(f"   Found {len(existing_users)} users:")
        for user in existing_users:
            print(f"   - ID: {user[0]}, Email: {user[1]}, Username: {user[2]}, Role: {user[3]}, Provider: {user[4]}")
    else:
        print("   No users found in database!")
    
    # Step 2: Create/Update test users with known credentials
    print("\n2. Creating/Updating test users with known credentials...")
    
    test_users = [
        {
            'email': 'patient@example.com',
            'username': 'patient',
            'password': 'Patient@123',
            'role': 'USER',
            'provider': 'password'
        },
        {
            'email': 'admin@example.com',
            'username': 'admin',
            'password': 'Admin@123',
            'role': 'LAB_ADMIN',
            'provider': 'password'
        },
        {
            'email': 'user@test.com',
            'username': 'testuser',
            'password': 'Test@123',
            'role': 'USER',
            'provider': 'password'
        }
    ]
    
    for user_data in test_users:
        # Check if user exists
        cur.execute("SELECT id, email FROM users WHERE email=%s OR username=%s", 
                   (user_data['email'], user_data['username']))
        existing = cur.fetchone()
        
        # Hash password
        password_hash = bcrypt.hashpw(user_data['password'].encode('utf-8'), 
                                     bcrypt.gensalt(12)).decode('utf-8')
        
        if existing:
            # Update existing user
            cur.execute("""
                UPDATE users 
                SET username=%s, password_hash=%s, role=%s, provider=%s
                WHERE email=%s
            """, (user_data['username'], password_hash, user_data['role'], 
                 user_data['provider'], user_data['email']))
            print(f"   ✓ Updated: {user_data['email']} (username: {user_data['username']})")
        else:
            # Insert new user
            cur.execute("""
                INSERT INTO users (email, username, password_hash, role, provider) 
                VALUES (%s, %s, %s, %s, %s)
            """, (user_data['email'], user_data['username'], password_hash, 
                 user_data['role'], user_data['provider']))
            print(f"   ✓ Created: {user_data['email']} (username: {user_data['username']})")
        
        # If LAB_ADMIN, add to whitelist
        if user_data['role'] == 'LAB_ADMIN':
            cur.execute("INSERT IGNORE INTO lab_admin_users (email) VALUES (%s)", 
                       (user_data['email'],))
    
    conn.commit()
    
    # Step 3: Verify the fix
    print("\n3. Verifying users after fix...")
    cur.execute("SELECT id, email, username, role, provider FROM users WHERE provider='password'")
    verified_users = cur.fetchall()
    
    print(f"   Found {len(verified_users)} password-based users:")
    for user in verified_users:
        print(f"   - Email: {user[1]}, Username: {user[2]}, Role: {user[3]}")
    
    cur.close()
    conn.close()
    
    # Step 4: Print login credentials
    print("\n" + "=" * 80)
    print("TEST LOGIN CREDENTIALS")
    print("=" * 80)
    print("\nYou can now login with any of these credentials:\n")
    for user_data in test_users:
        print(f"Email/Username: {user_data['email']} OR {user_data['username']}")
        print(f"Password: {user_data['password']}")
        print(f"Role: {user_data['role']}")
        print("-" * 80)
    
    print("\n✓ Login fix completed successfully!")
    print("=" * 80)

if __name__ == "__main__":
    try:
        fix_logins()
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        import traceback
        traceback.print_exc()
