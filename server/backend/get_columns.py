"""
Get actual column names from lab_staff table
"""
import sys
sys.path.append('.')
from db_connect import get_connection

try:
    conn = get_connection()
    cur = conn.cursor()
    
    # Get column names
    cur.execute("SELECT * FROM lab_staff LIMIT 0")
    columns = [desc[0] for desc in cur.description]
    
    print("✅ Columns in lab_staff table:")
    print("=" * 50)
    for i, col in enumerate(columns, 1):
        print(f"{i}. {col}")
    print("=" * 50)
    
    # Get count
    cur.execute("SELECT COUNT(*) FROM lab_staff")
    count = cur.fetchone()[0]
    print(f"\nTotal rows: {count}")
    
    if count > 0:
        print("\nFetching first row...")
        cur.execute(f"SELECT * FROM lab_staff LIMIT 1")
        row = cur.fetchone()
        print("\nFirst row data:")
        for col, val in zip(columns, row):
            print(f"  {col}: {val}")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
