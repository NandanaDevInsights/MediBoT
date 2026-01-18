"""
Script to promote an existing user to Lab Admin
This adds their email to lab_admin_users and updates their role
"""
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def promote_to_lab_admin(email):
    """Promote an existing user to Lab Admin role"""
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("=" * 70)
        print(f"PROMOTING {email} TO LAB ADMIN")
        print("=" * 70)
        
        # Check if user exists
        cur.execute("SELECT id, email, role FROM users WHERE email=%s", (email,))
        user = cur.fetchone()
        
        if not user:
            print(f"\n❌ User {email} does not exist in the system")
            print("\nOptions:")
            print("1. Sign up first at: http://localhost:5173/admin/signup")
            print("2. Or use this script after signing up")
            cur.close()
            conn.close()
            return
        
        user_id, user_email, current_role = user
        print(f"\n✓ User found:")
        print(f"  ID: {user_id}")
        print(f"  Email: {user_email}")
        print(f"  Current Role: {current_role}")
        
        # Add to lab_admin_users whitelist
        print(f"\n1. Adding to lab_admin_users whitelist...")
        try:
            cur.execute("INSERT INTO lab_admin_users (email) VALUES (%s)", (email,))
            conn.commit()
            print(f"   ✓ Added to whitelist")
        except mysql.connector.IntegrityError:
            print(f"   ℹ Already in whitelist")
        
        # Update role to LAB_ADMIN
        print(f"\n2. Updating role to LAB_ADMIN...")
        if current_role == "LAB_ADMIN":
            print(f"   ℹ Already has LAB_ADMIN role")
        else:
            cur.execute("UPDATE users SET role='LAB_ADMIN' WHERE email=%s", (email,))
            conn.commit()
            print(f"   ✓ Role updated: {current_role} → LAB_ADMIN")
        
        print("\n" + "=" * 70)
        print("✅ SUCCESS!")
        print("=" * 70)
        print(f"\n{email} is now a Lab Admin!")
        print("\nNext steps:")
        print("1. Go to: http://localhost:5173/admin/login")
        print("2. Login with your credentials")
        print("3. You'll be redirected to Lab Admin Dashboard")
        print("\n" + "=" * 70)
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

def list_all_users():
    """List all users and their roles"""
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("\n" + "=" * 70)
        print("ALL USERS IN SYSTEM")
        print("=" * 70)
        
        cur.execute("""
            SELECT u.id, u.email, u.role, u.created_at,
                   CASE WHEN la.email IS NOT NULL THEN 1 ELSE 0 END as in_whitelist
            FROM users u
            LEFT JOIN lab_admin_users la ON u.email = la.email
            ORDER BY u.created_at DESC
        """)
        users = cur.fetchall()
        
        if not users:
            print("\nNo users found")
        else:
            print(f"\nTotal users: {len(users)}\n")
            for user_id, email, role, created_at, in_whitelist in users:
                whitelist_status = "✓ Whitelisted" if in_whitelist else "✗ Not whitelisted"
                print(f"ID: {user_id}")
                print(f"  Email: {email}")
                print(f"  Role: {role}")
                print(f"  Whitelist: {whitelist_status}")
                print(f"  Created: {created_at}")
                print()
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("=" * 70)
        print("PROMOTE USER TO LAB ADMIN")
        print("=" * 70)
        print("\nUsage:")
        print("  python promote_to_admin.py <email>")
        print("  python promote_to_admin.py --list")
        print("\nExamples:")
        print("  python promote_to_admin.py admin@lab.com")
        print("  python promote_to_admin.py --list")
        print("\n" + "=" * 70)
        sys.exit(1)
    
    if sys.argv[1] == "--list":
        list_all_users()
    else:
        email = sys.argv[1].strip()
        promote_to_lab_admin(email)
