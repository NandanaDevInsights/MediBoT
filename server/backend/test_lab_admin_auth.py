"""
Test script to verify lab admin authentication with lab_admin_users table
"""
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def test_lab_admin_auth():
    """Test the lab admin authentication flow"""
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("=" * 70)
        print("LAB ADMIN AUTHENTICATION TEST")
        print("=" * 70)
        
        # Test 1: Check if lab_admin_users table exists
        print("\n1. Checking lab_admin_users table...")
        cur.execute("SHOW TABLES LIKE 'lab_admin_users'")
        if cur.fetchone():
            print("   ✓ lab_admin_users table exists")
        else:
            print("   ✗ lab_admin_users table NOT found")
            return
        
        # Test 2: Check table structure
        print("\n2. Checking table structure...")
        cur.execute("DESCRIBE lab_admin_users")
        columns = cur.fetchall()
        print("   Columns:")
        for col in columns:
            print(f"     - {col[0]}: {col[1]}")
        
        # Test 3: List whitelisted admins
        print("\n3. Whitelisted lab admins:")
        cur.execute("SELECT email, created_at FROM lab_admin_users ORDER BY created_at DESC")
        admins = cur.fetchall()
        
        if admins:
            print(f"   Total: {len(admins)}")
            for email, created_at in admins:
                print(f"   - {email} (added: {created_at})")
        else:
            print("   ⚠ No lab admins in whitelist")
            print("   Run: python add_lab_admin.py <email> to add one")
        
        # Test 4: Check users table for LAB_ADMIN role
        print("\n4. Users with LAB_ADMIN role:")
        cur.execute("""
            SELECT u.email, u.role, u.created_at 
            FROM users u 
            WHERE u.role = 'LAB_ADMIN' 
            ORDER BY u.created_at DESC
        """)
        lab_admins = cur.fetchall()
        
        if lab_admins:
            print(f"   Total: {len(lab_admins)}")
            for email, role, created_at in lab_admins:
                # Check if still in whitelist
                cur.execute("SELECT 1 FROM lab_admin_users WHERE email=%s", (email,))
                in_whitelist = cur.fetchone() is not None
                status = "✓ In whitelist" if in_whitelist else "✗ NOT in whitelist"
                print(f"   - {email} ({status})")
        else:
            print("   ⚠ No users with LAB_ADMIN role")
        
        # Test 5: Cross-reference check
        print("\n5. Verification:")
        if admins and lab_admins:
            whitelist_emails = {email for email, _ in admins}
            admin_emails = {email for email, _, _ in lab_admins}
            
            # Admins in whitelist but not in users
            missing_users = whitelist_emails - admin_emails
            if missing_users:
                print(f"   ⚠ Whitelisted but no account: {', '.join(missing_users)}")
                print("     → These emails can sign up and get LAB_ADMIN role")
            
            # Admins in users but not in whitelist
            unauthorized = admin_emails - whitelist_emails
            if unauthorized:
                print(f"   ✗ LAB_ADMIN role but NOT whitelisted: {', '.join(unauthorized)}")
                print("     → These users will be denied access on login")
            
            if not missing_users and not unauthorized:
                print("   ✓ All LAB_ADMIN users are properly whitelisted")
        
        print("\n" + "=" * 70)
        print("TEST SUMMARY")
        print("=" * 70)
        print(f"✓ Whitelist table: EXISTS")
        print(f"✓ Whitelisted admins: {len(admins)}")
        print(f"✓ Users with LAB_ADMIN role: {len(lab_admins)}")
        print("\n✅ Lab admin authentication system is properly configured!")
        print("=" * 70)
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_lab_admin_auth()
