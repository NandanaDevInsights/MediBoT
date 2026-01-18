"""
Script to add a lab admin email to the whitelist (lab_admin_users table)
This allows the email to sign up and get LAB_ADMIN role automatically
"""
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def add_lab_admin(email):
    """Add an email to the lab_admin_users whitelist"""
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        # Check if table exists
        cur.execute("SHOW TABLES LIKE 'lab_admin_users'")
        if not cur.fetchone():
            print("Creating lab_admin_users table...")
            cur.execute("""
                CREATE TABLE lab_admin_users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
            print("✓ Table created")
        
        # Add email to whitelist
        try:
            cur.execute("INSERT INTO lab_admin_users (email) VALUES (%s)", (email,))
            conn.commit()
            print(f"✓ Successfully added {email} to lab admin whitelist")
            print(f"\n{email} can now:")
            print("  1. Sign up and automatically get LAB_ADMIN role")
            print("  2. Log in and access the Lab Admin Dashboard")
        except mysql.connector.IntegrityError:
            print(f"ℹ {email} is already in the whitelist")
        
        # Show all whitelisted admins
        cur.execute("SELECT email, created_at FROM lab_admin_users ORDER BY created_at DESC")
        admins = cur.fetchall()
        
        print(f"\n📋 Total whitelisted lab admins: {len(admins)}")
        if admins:
            print("\nWhitelisted emails:")
            for admin_email, created_at in admins:
                print(f"  - {admin_email} (added: {created_at})")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python add_lab_admin.py <email>")
        print("Example: python add_lab_admin.py admin@lab.com")
        sys.exit(1)
    
    email = sys.argv[1].strip()
    add_lab_admin(email)
