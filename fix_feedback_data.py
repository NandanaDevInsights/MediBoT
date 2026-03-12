import os
from dotenv import load_dotenv
import mysql.connector

def fix_feedback():
    load_dotenv('server/backend/.env')
    try:
        conn = mysql.connector.connect(
            host=os.environ.get('DB_HOST'),
            port=int(os.environ.get('DB_PORT', 3306)),
            user=os.environ.get('DB_USER'),
            password=os.environ.get('DB_PASSWORD', ''),
            database=os.environ.get('DB_NAME')
        )
        cur = conn.cursor()
        
        # 1. Get all current lab profiles
        cur.execute('SELECT lab_id, lab_name FROM lab_admin_profile')
        labs = cur.fetchall()
        print(f"Current profiles: {labs}")
        
        for lid, lname in labs:
            # Check if this lab has any feedback
            # Check by both ID and Name to be sure
            cur.execute('SELECT COUNT(*) FROM lab_feedback WHERE lab_id=%s OR TRIM(lab_name)=TRIM(%s)', (lid, lname))
            count = cur.fetchone()[0]
            print(f"Lab '{lname}' (ID: {lid}) currently has {count} feedbacks.")
            
            if count == 0:
                print(f"Adding sample feedback for '{lname}'...")
                feedbacks = [
                    (lid, lname, 'Rahul Sharma', 'Abhijith', 5, 'Excellent service and very professional staff. Accurate results.', 'General'),
                    (lid, lname, 'Anita Desai', 'Ankith', 4, 'Clean facility, friendly atmosphere.', 'Facility'),
                    (lid, lname, 'Suresh Iyer', 'James', 5, 'Quick reports and very helpful team. Highly recommended.', 'Service')
                ]
                for f in feedbacks:
                    cur.execute("""
                        INSERT INTO lab_feedback (lab_id, lab_name, patient_name, username, rating, comment, category)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, f)
                print(f"✅ Added 3 feedback entries for '{lname}'.")
        
        # 2. Add username column if missing (just in case app.py didn't do it)
        cur.execute("SHOW COLUMNS FROM lab_feedback LIKE 'username'")
        if not cur.fetchone():
            print("Adding 'username' column...")
            cur.execute("ALTER TABLE lab_feedback ADD COLUMN username VARCHAR(255) AFTER patient_name")
        
        # 3. Update username from patient_name where null
        cur.execute("UPDATE lab_feedback SET username = LOWER(REPLACE(patient_name, ' ', '_')) WHERE username IS NULL")
        
        conn.commit()
        print("Done!")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_feedback()
