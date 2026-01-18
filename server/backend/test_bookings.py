"""
Test script to verify bookings table functionality
This script checks if the bookings table exists and can be queried
"""
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def test_bookings_table():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("Testing bookings table...")
        
        # Check if table exists
        cur.execute("SHOW TABLES LIKE 'bookings'")
        result = cur.fetchone()
        
        if result:
            print("✓ Bookings table exists")
            
            # Get table structure
            cur.execute("DESCRIBE bookings")
            columns = cur.fetchall()
            print("\nTable structure:")
            for col in columns:
                print(f"  - {col[0]}: {col[1]}")
            
            # Count bookings
            cur.execute("SELECT COUNT(*) FROM bookings")
            count = cur.fetchone()[0]
            print(f"\nTotal bookings in table: {count}")
            
            # Show recent bookings
            if count > 0:
                cur.execute("""
                    SELECT booking_id, patient_name, lab_id, preferred_date, preferred_time, booking_status
                    FROM bookings
                    ORDER BY created_at DESC
                    LIMIT 5
                """)
                bookings = cur.fetchall()
                print("\nRecent bookings:")
                for b in bookings:
                    print(f"  ID: {b[0]}, Patient: {b[1]}, Lab ID: {b[2]}, Date: {b[3]}, Time: {b[4]}, Status: {b[5]}")
        else:
            print("✗ Bookings table does not exist")
        
        cur.close()
        conn.close()
        print("\n✓ Test completed successfully")
        
    except Exception as e:
        print(f"✗ Test failed: {e}")

if __name__ == "__main__":
    test_bookings_table()
