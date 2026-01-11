
import mysql.connector
import bcrypt
import os

# Connect to DB
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="medibot"
)
cur = conn.cursor()

email = "admin@example.com"
password = "Admin@123"

# Hash password
# Note: In app.py rounds=12 is used. We replicate it.
hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(12)).decode("utf-8")

# 1. Ensure user exists in users table with role LAB_ADMIN
print("Upserting user...")
# Check if exists
cur.execute("SELECT id FROM users WHERE email=%s", (email,))
row = cur.fetchone()

if row:
    print(f"Update existing user {row[0]}")
    cur.execute("UPDATE users SET password_hash=%s, role='LAB_ADMIN', provider='password' WHERE id=%s", (hashed, row[0]))
else:
    print("Insert new user")
    cur.execute("INSERT INTO users (email, password_hash, role, provider) VALUES (%s, %s, 'LAB_ADMIN', 'password')", (email, hashed))

# 2. Add to Whitelist
print("Updating whitelist...")
cur.execute("INSERT IGNORE INTO lab_admin_users (email) VALUES (%s)", (email,))

# 3. Add to Lab Admin Profile (optional but good for 'Settings' view)
print("Updating profile...")
cur.execute("SELECT id FROM users WHERE email=%s", (email,))
uid = cur.fetchone()[0]
cur.execute("""
    INSERT INTO lab_admin_profile (user_id, lab_name, address, contact_number)
    VALUES (%s, 'City Central Lab', '123 Medical Drive, Tech City', '555-0123')
    ON DUPLICATE KEY UPDATE lab_name='City Central Lab'
""", (uid,))

conn.commit()
print("Done. Login with admin@example.com / Admin@123")
cur.close()
conn.close()
