"""
Simple script to check lab_feedback table
"""
import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')

from db_connect import get_connection

def check_table():
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Simple count
        cur.execute("SELECT * FROM lab_feedback LIMIT 10")
        rows = cur.fetchall()
        
        print(f"\n✅ Found {len(rows)} feedback entries")
        for row in rows:
            print(row)
        
        cur.close()
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()

if __name__ == "__main__":
    check_table()
