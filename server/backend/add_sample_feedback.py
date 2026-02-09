"""
Script to add sample feedback data to lab_feedback table for testing
"""
import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')

from db_connect import get_connection

def add_sample_feedback():
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Sample feedback data
        sample_feedbacks = [
            (1, 'CityPath Diagnostics', 'Rahul Sharma', 5, 'Excellent service and very professional staff. Quick turnaround time for reports.', 'Service'),
            (1, 'CityPath Diagnostics', 'Anita Desai', 4, 'Clean facility and good staff. Reports were slightly delayed but accurate.', 'Facility'),
            (1, 'CityPath Diagnostics', 'Suresh Iyer', 5, 'Best lab in the area. Very accurate results and helpful staff.', 'Accuracy'),
            (1, 'CityPath Diagnostics', 'Priya Patel', 5, 'Home collection service was excellent. Very professional phlebotomist.', 'Service'),
            (1, 'CityPath Diagnostics', 'Amit Kumar', 3, 'Good service but waiting time was a bit long.', 'General'),
        ]
        
        for feedback in sample_feedbacks:
            try:
                cur.execute("""
                    INSERT INTO lab_feedback (lab_id, lab_name, patient_name, rating, comment, category)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, feedback)
            except Exception as e:
                print(f"Note: {e}")
        
        conn.commit()
        print("✅ Sample feedback data added successfully!")
        
        # Verify the data
        cur.execute("SELECT COUNT(*) FROM lab_feedback")
        count = cur.fetchone()[0]
        print(f"Total feedback entries: {count}")
        
        cur.close()
        
    except Exception as e:
        print(f"Error adding sample data: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    add_sample_feedback()
