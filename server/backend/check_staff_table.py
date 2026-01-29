"""
Quick script to check if lab_staff table exists and has data
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
        print("❌ ERROR: 'lab_staff' table does NOT exist in the database!")
        print("\nYou need to create the table first. SQL:")
        print("""
CREATE TABLE lab_staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    role_designation VARCHAR(100),
    contact_number VARCHAR(20),
    email VARCHAR(255),
    shift_timing VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active',
    specialization VARCHAR(255),
    hire_date DATE,
    department VARCHAR(100)
);
        """)
    else:
        print("✅ Table 'lab_staff' exists!")
        
        # Check data
        cur.execute("SELECT COUNT(*) FROM lab_staff")
        count = cur.fetchone()[0]
        
        if count == 0:
            print(f"⚠️  WARNING: Table exists but has NO data (0 rows)")
            print("\nSample INSERT query:")
            print("""
INSERT INTO lab_staff (full_name, role_designation, contact_number, email, shift_timing, status, department)
VALUES 
    ('Dr. Sarah Johnson', 'Lab Technician', '+91 9876543210', 'sarah@medibot.com', 'Morning (9AM-5PM)', 'Active', 'Pathology'),
    ('John Smith', 'Senior Technician', '+91 9876543211', 'john@medibot.com', 'Evening (2PM-10PM)', 'Active', 'Radiology'),
    ('Mary Williams', 'Lab Assistant', '+91 9876543212', 'mary@medibot.com', 'Morning (9AM-5PM)', 'Active', 'Hematology');
            """)
        else:
            print(f"✅ Table has {count} staff member(s)!")
            
            # Show first 3 records
            cur.execute("SELECT id, full_name, role_designation, status FROM lab_staff LIMIT 3")
            rows = cur.fetchall()
            print("\nSample Data:")
            print("-" * 60)
            for row in rows:
                print(f"ID: {row[0]}, Name: {row[1]}, Role: {row[2]}, Status: {row[3]}")
            print("-" * 60)
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Database Error: {e}")
    print("\nMake sure your database connection is configured correctly in .env")
