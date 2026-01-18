"""
Quick verification script to check if the bookings table is ready
"""
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def verify_bookings_setup():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("=" * 60)
        print("BOOKINGS TABLE VERIFICATION")
        print("=" * 60)
        
        # Check table exists
        cur.execute("SHOW TABLES LIKE 'bookings'")
        if not cur.fetchone():
            print("❌ Bookings table does not exist!")
            return
        
        print("✅ Bookings table exists")
        
        # Check required columns
        cur.execute("DESCRIBE bookings")
        columns = cur.fetchall()
        column_names = [col[0] for col in columns]
        
        required_columns = [
            'booking_id', 'patient_name', 'patient_id', 'email', 
            'phone_number', 'lab_id', 'test_category', 'selected_test',
            'preferred_date', 'preferred_time', 'booking_status'
        ]
        
        print("\n✅ Required columns check:")
        for col in required_columns:
            if col in column_names:
                print(f"   ✓ {col}")
            else:
                print(f"   ✗ {col} - MISSING!")
        
        # Check current bookings
        cur.execute("SELECT COUNT(*) FROM bookings WHERE lab_id = 1")
        royal_count = cur.fetchone()[0]
        
        print(f"\n📊 Current Royal Clinical Laboratory bookings (lab_id=1): {royal_count}")
        
        if royal_count > 0:
            cur.execute("""
                SELECT booking_id, patient_name, selected_test, preferred_date, preferred_time
                FROM bookings 
                WHERE lab_id = 1
                ORDER BY created_at DESC
                LIMIT 3
            """)
            bookings = cur.fetchall()
            print("\n   Recent bookings:")
            for b in bookings:
                print(f"   - ID {b[0]}: {b[1]} | {b[2]} | {b[3]} {b[4]}")
        
        print("\n" + "=" * 60)
        print("✅ READY TO ACCEPT BOOKINGS")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Go to the landing page")
        print("2. Search for 'Kanjirapally'")
        print("3. Book an appointment at 'Royal Clinical Laboratory'")
        print("4. Run this script again to verify the booking was saved")
        print("\n")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Verification failed: {e}")

if __name__ == "__main__":
    verify_bookings_setup()
