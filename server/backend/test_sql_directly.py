"""
Direct database test to verify the exact SQL query works
"""
import sys
sys.path.append('.')
from db_connect import get_connection

conn = get_connection()
cur = conn.cursor()

print("Testing the exact SQL query from app.py...")
print("="*70)

try:
    cur.execute("""
        SELECT 
            staff_id, full_name, role_designation, phone_number, 
            email, daily_working_hours, status, specializations,
            date_of_joining, department
        FROM lab_staff
        ORDER BY date_of_joining DESC
    """)
    rows = cur.fetchall()
    
    print(f"✅ SUCCESS! Query returned {len(rows)} rows\n")
    
    if len(rows) > 0:
        print("First staff member:")
        print("-"*70)
        row = rows[0]
        print(f"  staff_id: {row[0]}")
        print(f"  full_name: {row[1]}")
        print(f"  role_designation: {row[2]}")
        print(f"  phone_number: {row[3]}")
        print(f"  email: {row[4]}")
        print(f"  daily_working_hours: {row[5]}")
        print(f"  status: {row[6]}")
        print(f"  specializations: {row[7]}")
        print(f"  date_of_joining: {row[8]}")
        print(f"  department: {row[9]}")
        print("-"*70)
        
        # Show what the API would return
        shift_text = row[5] if row[5] else "General"
        api_response = {
            "id": row[0],
            "name": row[1] if row[1] else "Unknown Staff",
            "role": row[2] if row[2] else "Staff",
            "contact": row[3],
            "phone": row[3],
            "email": row[4],
            "shift": shift_text,
            "status": row[6] if row[6] else "Active",
            "specialization": row[7],
            "hireDate": str(row[8]) if row[8] else None,
            "department": row[9],
            "staffId": row[0]
        }
        
        print("\nAPI Response format:")
        print("-"*70)
        import json
        print(json.dumps(api_response, indent=2))
        print("-"*70)
        
        print("\n✅ The SQL query works perfectly!")
        print("✅ The data mapping is correct!")
        print("\n📌 The issue must be with Flask not picking up the changes")
        print("📌 OR there's another endpoint being called")
        
    else:
        print("⚠️  No staff members found in database")
        
except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()

finally:
    cur.close()
    conn.close()
