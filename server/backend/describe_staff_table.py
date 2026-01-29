"""
Check the actual structure of lab_staff table
"""
import sys
sys.path.append('.')
from db_connect import get_connection

try:
    conn = get_connection()
    cur = conn.cursor()
    
    # Check if table exists
    cur.execute("SHOW TABLES LIKE 'lab_staff'")
    table_exists = cur.fetchone()
    
    if not table_exists:
        print("❌ ERROR: 'lab_staff' table does NOT exist!")
    else:
        print("✅ Table 'lab_staff' exists!")
        
        # Show table structure
        cur.execute("DESCRIBE lab_staff")
        columns = cur.fetchall()
        
        print("\n📋 Table Structure:")
        print("-" * 80)
        print(f"{'Field':<25} {'Type':<20} {'Null':<8} {'Key':<8} {'Default':<15}")
        print("-" * 80)
        for col in columns:
            print(f"{col[0]:<25} {col[1]:<20} {col[2]:<8} {col[3]:<8} {str(col[4]):<15}")
        print("-" * 80)
        
        # Count rows
        cur.execute("SELECT COUNT(*) FROM lab_staff")
        count = cur.fetchone()[0]
        print(f"\n📊 Total Records: {count}")
        
        if count > 0:
            # Show sample data
            cur.execute("SELECT * FROM lab_staff LIMIT 2")
            rows = cur.fetchall()
            print("\n📝 Sample Data (first 2 rows):")
            for row in rows:
                print(row)
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
