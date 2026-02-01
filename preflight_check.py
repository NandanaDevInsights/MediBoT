"""
Final Pre-Flight Check - Verify everything is ready for login
"""

import os
import mysql.connector
from dotenv import load_dotenv
import requests

load_dotenv('server/backend/.env')

print("\n" + "=" * 100)
print(" " * 35 + "PRE-FLIGHT CHECK")
print("=" * 100)

# Check 1: Database Connection
print("\n[1/4] Checking database connection...")
try:
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot_final")
    )
    print("      ✓ Database connection successful")
    
    # Check 2: Verify users exist
    print("\n[2/4] Verifying test users exist...")
    cur = conn.cursor()
    cur.execute("""
        SELECT email, username, role, 
               CASE WHEN password_hash IS NOT NULL AND password_hash != '' THEN 'YES' ELSE 'NO' END as has_pwd
        FROM users 
        WHERE email IN ('patient@example.com', 'admin@example.com', 'user@test.com')
        ORDER BY role
    """)
    
    users = cur.fetchall()
    if len(users) >= 3:
        print("      ✓ All test users exist:")
        for user in users:
            print(f"        - {user[0]:30} | Username: {user[1]:15} | Role: {user[2]:12} | Password: {user[3]}")
    else:
        print(f"      ✗ WARNING: Only {len(users)}/3 test users found!")
    
    # Check 3: Verify username field is populated
    print("\n[3/4] Checking for NULL usernames...")
    cur.execute("SELECT COUNT(*) FROM users WHERE username IS NULL OR username = ''")
    null_count = cur.fetchone()[0]
    if null_count == 0:
        print("      ✓ All users have valid usernames")
    else:
        print(f"      ✗ WARNING: {null_count} users have NULL/empty usernames!")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"      ✗ Database error: {e}")

# Check 4: Backend server
print("\n[4/4] Checking backend server...")
try:
    response = requests.get('http://localhost:5000/health', timeout=3)
    if response.status_code == 200:
        print("      ✓ Backend server is running on http://localhost:5000")
    else:
        print(f"      ! Backend server responded with status {response.status_code}")
except requests.exceptions.ConnectionError:
    print("      ✗ Backend server is NOT running")
    print("        → Please start the server: cd server/backend && python app.py")
except requests.exceptions.Timeout:
    print("      ✗ Backend server is not responding")
except Exception as e:
    print(f"      ✗ Error checking server: {e}")

print("\n" + "=" * 100)
print(" " * 30 + "RECOMMENDED TEST CREDENTIALS")
print("=" * 100)
print("\n┌─────────────────────────────────────────────────────────────────────────────┐")
print("│ USER LOGIN (Patient)                                                        │")
print("├─────────────────────────────────────────────────────────────────────────────┤")
print("│ Email/Username: patient@example.com  OR  patient                           │")
print("│ Password:       Patient@123                                                 │")
print("│ Note:           OTP will be sent to email for verification                 │")
print("└─────────────────────────────────────────────────────────────────────────────┘")

print("\n┌─────────────────────────────────────────────────────────────────────────────┐")
print("│ ADMIN LOGIN (Lab Administrator)                                             │")
print("├─────────────────────────────────────────────────────────────────────────────┤")
print("│ Email/Username: admin@example.com  OR  admin                               │")
print("│ Password:       Admin@123                                                   │")
print("│ Note:           Direct login without OTP, redirects to dashboard           │")
print("└─────────────────────────────────────────────────────────────────────────────┘")

print("\n" + "=" * 100)
print("                              ✓ PRE-FLIGHT CHECK COMPLETE")
print("=" * 100 + "\n")
