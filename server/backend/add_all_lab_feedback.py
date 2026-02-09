import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def fix_and_populate():
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # 1. Ensure lab_feedback has correct columns
        cur.execute("DROP TABLE IF EXISTS lab_feedback")
        cur.execute("""
            CREATE TABLE lab_feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                lab_id INT DEFAULT 0,
                lab_name VARCHAR(255),
                patient_name VARCHAR(255),
                rating INT,
                comment TEXT,
                category VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 2. Add feedback for ALL currently registered labs
        cur.execute("SELECT lab_name FROM lab_admin_profile")
        lab_names = [row[0] for row in cur.fetchall()]
        
        # Also add generic one for Royal Clinical if not there
        if "Royal Clinical" not in lab_names: lab_names.append("Royal Clinical")
        if "CityPath Diagnostics" not in lab_names: lab_names.append("CityPath Diagnostics")
        
        for name in lab_names:
            feedbacks = [
                (name, 'Rahul Sharma', 5, 'Excellent service and very professional staff. Accurate results.', 'General'),
                (name, 'Anita Desai', 4, 'Clean facility, friendly atmosphere.', 'Facility'),
                (name, 'Suresh Iyer', 5, 'Quick reports and very helpful team. Highly recommended.', 'Service')
            ]
            for f in feedbacks:
                cur.execute("""
                    INSERT INTO lab_feedback (lab_name, patient_name, rating, comment, category)
                    VALUES (%s, %s, %s, %s, %s)
                """, f)
        
        conn.commit()
        print(f"✅ Created feedback for {len(lab_names)} labs.")
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    fix_and_populate()
