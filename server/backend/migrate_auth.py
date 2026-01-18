
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def migrate():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("--- Starting Migration ---")
        
        # 1. Add username to users
        try:
            print("Adding username column to users...")
            cur.execute("SELECT username FROM users LIMIT 1")
            print("Column 'username' already exists.")
        except:
            cur.execute("ALTER TABLE users ADD COLUMN username VARCHAR(255) UNIQUE AFTER email")
            print("Column 'username' added.")
            
            # Backfill username from email
            cur.execute("SELECT id, email FROM users")
            rows = cur.fetchall()
            for uid, email in rows:
                username = email.split('@')[0]
                # Ensure uniqueness if duplicated
                base = username
                count = 1
                while True:
                    try:
                        cur.execute("UPDATE users SET username=%s WHERE id=%s", (username, uid))
                        conn.commit()
                        break
                    except mysql.connector.errors.IntegrityError:
                        username = f"{base}{count}"
                        count += 1
            print("Backfilled usernames.")

        # 2. Sync Lab Admins to lab_admin_users
        print("Syncing Lab Admins...")
        cur.execute("SELECT id, email, password_hash, role, created_at, pin_code FROM users WHERE role='LAB_ADMIN'")
        admins = cur.fetchall()
        
        for admin in admins:
            uid, email, phash, role, created, pin = admin
            
            # Check if exists in lab_admin_users
            cur.execute("SELECT id FROM lab_admin_users WHERE email=%s", (email,))
            if cur.fetchone():
                print(f"Admin {email} already in lab_admin_users.")
            else:
                # Insert
                # Note: We try to preserve ID? 
                # lab_admin_users ID is primary key.
                # If we insert with ID, we might conflict if lab_admin_users already has rows.
                # But looking at table_info, it's auto-increment.
                # If table is empty, we can force ID.
                try:
                    cur.execute("""
                        INSERT INTO lab_admin_users (id, email, password_hash, role, created_at, pin_code, provider)
                        VALUES (%s, %s, %s, %s, %s, %s, 'password')
                    """, (uid, email, phash, role, created, pin))
                    print(f"Migrated admin {email} (ID: {uid})")
                except Exception as e:
                    print(f"Could not migrate admin {email} with ID {uid}: {e}")
                    # Try without ID? But this breaks profile link
                    
        # 3. Update lab_admin_profile Foreign Key
        # First, find constraint name
        try:
            cur.execute("""
                SELECT CONSTRAINT_NAME 
                FROM information_schema.KEY_COLUMN_USAGE 
                WHERE TABLE_NAME = 'lab_admin_profile' 
                AND COLUMN_NAME = 'user_id'
                AND REFERENCED_TABLE_NAME = 'users'
                AND TABLE_SCHEMA = %s
            """, (os.environ.get("DB_NAME", "medibot"),))
            
            row = cur.fetchone()
            if row:
                constraint_name = row[0]
                print(f"Dropping constraint {constraint_name} on lab_admin_profile...")
                cur.execute(f"ALTER TABLE lab_admin_profile DROP FOREIGN KEY {constraint_name}")
                conn.commit()
                print("Constraint dropped.")
            else:
                print("No FK constraint to users found on lab_admin_profile.")
                
            # Note: We do NOT add FK to lab_admin_users immediately because IDs might mismatched if we failed preservation.
            # But mostly we assume separation is the goal.
            
        except Exception as e:
            print(f"Error updating constraints: {e}")

        conn.commit()        
        cur.close()
        conn.close()
        print("Migration Completed.")
        
    except Exception as e:
        print(f"Migration Failed: {e}")

if __name__ == "__main__":
    migrate()
