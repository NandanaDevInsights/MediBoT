"""
Script to add/update lab admin profile data
"""
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def add_profile(email, admin_name, lab_name, address=None, contact=None):
    """Add or update profile for a lab admin"""
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("=" * 70)
        print(f"ADDING PROFILE FOR {email}")
        print("=" * 70)
        
        # Get user_id
        cur.execute("SELECT id, email, role FROM users WHERE email=%s", (email,))
        user = cur.fetchone()
        
        if not user:
            print(f"\n❌ User {email} not found")
            print("\nPlease sign up first or check the email address")
            cur.close()
            conn.close()
            return
        
        user_id, user_email, role = user
        print(f"\n✓ User found:")
        print(f"  ID: {user_id}")
        print(f"  Email: {user_email}")
        print(f"  Role: {role}")
        
        if role not in ["LAB_ADMIN", "SUPER_ADMIN"]:
            print(f"\n⚠ Warning: User role is '{role}', not LAB_ADMIN")
            print("  Consider promoting to LAB_ADMIN first:")
            print(f"  python promote_to_admin.py {email}")
        
        # Check if profile exists
        cur.execute("SELECT id FROM lab_admin_profile WHERE user_id=%s", (user_id,))
        existing = cur.fetchone()
        
        if existing:
            print(f"\n📝 Updating existing profile...")
            cur.execute("""
                UPDATE lab_admin_profile 
                SET admin_name=%s, lab_name=%s, address=%s, contact_number=%s
                WHERE user_id=%s
            """, (admin_name, lab_name, address, contact, user_id))
            print(f"   ✓ Profile updated")
        else:
            print(f"\n📝 Creating new profile...")
            cur.execute("""
                INSERT INTO lab_admin_profile (user_id, admin_name, lab_name, address, contact_number)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_id, admin_name, lab_name, address, contact))
            print(f"   ✓ Profile created")
        
        conn.commit()
        
        # Show final profile
        cur.execute("""
            SELECT admin_name, lab_name, address, contact_number
            FROM lab_admin_profile
            WHERE user_id=%s
        """, (user_id,))
        profile = cur.fetchone()
        
        print("\n" + "=" * 70)
        print("✅ PROFILE SAVED")
        print("=" * 70)
        if profile:
            admin_name_db, lab_name_db, address_db, contact_db = profile
            print(f"\nAdmin Name: {admin_name_db}")
            print(f"Lab Name: {lab_name_db}")
            print(f"Address: {address_db or 'Not set'}")
            print(f"Contact: {contact_db or 'Not set'}")
        
        print("\n" + "=" * 70)
        print("NEXT STEPS")
        print("=" * 70)
        print("1. Login to dashboard: http://localhost:5173/admin/login")
        print("2. Your profile data will now appear in the dashboard")
        print("3. Check the profile section and top-right menu")
        print("\n" + "=" * 70)
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 4:
        print("=" * 70)
        print("ADD LAB ADMIN PROFILE")
        print("=" * 70)
        print("\nUsage:")
        print("  python add_profile.py <email> <admin_name> <lab_name> [address] [contact]")
        print("\nExamples:")
        print('  python add_profile.py admin@lab.com "Dr. Smith" "Royal Clinical Lab"')
        print('  python add_profile.py admin@lab.com "Dr. Smith" "Royal Clinical Lab" "123 Main St" "1234567890"')
        print("\n" + "=" * 70)
        sys.exit(1)
    
    email = sys.argv[1].strip()
    admin_name = sys.argv[2].strip()
    lab_name = sys.argv[3].strip()
    address = sys.argv[4].strip() if len(sys.argv) > 4 else None
    contact = sys.argv[5].strip() if len(sys.argv) > 5 else None
    
    add_profile(email, admin_name, lab_name, address, contact)
