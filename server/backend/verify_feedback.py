"""
Script to test the lab_feedback endpoint and verify data
"""
import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')

from db_connect import get_connection

def verify_feedback_data():
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Check all feedback
        cur.execute("""
            SELECT id, lab_id, lab_name, patient_name, rating, category, 
                   DATE_FORMAT(created_at, '%Y-%m-%d') as date
            FROM lab_feedback
            ORDER BY created_at DESC
        """)
        
        rows = cur.fetchall()
        
        print(f"\n✅ Total feedback entries in database: {len(rows)}\n")
        print("-" * 100)
        print(f"{'ID':<5} {'Lab ID':<8} {'Lab Name':<25} {'Patient':<20} {'Rating':<8} {'Category':<12} {'Date'}")
        print("-" * 100)
        
        for row in rows:
            print(f"{row[0]:<5} {row[1]:<8} {row[2]:<25} {row[3]:<20} {row[4]:<8} {row[5]:<12} {row[6]}")
        
        print("-" * 100)
        print("\n✅ If you see data above, the database is populated correctly!")
        print("📌 Make sure your lab admin is logged in with a user that has lab_id=1 or lab_name='CityPath Diagnostics'")
        print("📌 The frontend will fetch this data when you navigate to Settings > Feedback & Ratings\n")
        
        cur.close()
        
    except Exception as e:
        print(f"Error verifying data: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    verify_feedback_data()
