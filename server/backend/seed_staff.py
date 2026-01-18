import mysql.connector
from db_connect import get_connection

def seed_staff():
    conn = get_connection()
    cur = conn.cursor()

    staff_members = [
        {
            "name": "Sarah",
            "gender": "Female",
            "dob": "1990-01-01",
            "phone": "+91 98765 43210",
            "email": "sarah@medibot.com",
            "address": "123, Sample Street, Sample City, India",
            "staff_id": "STA-8966",
            "role": "Lab Technician",
            "department": "Hematology",
            "employment_type": "Full-time",
            "joining_date": "2026-01-17",
            "experience": "2",
            "shift": "Morning Shift",
            "working_days": "Mon, Tue, Wed, Thu, Fri",
            "working_hours": "9:00 AM - 5:00 PM",
            "home_collection": 1,
            "specializations": "Biochemistry, Hematology",
            "emergency_name": "John",
            "emergency_relation": "Brother",
            "emergency_phone": "+91 91234 56789",
            "qualification": "Lab Technician Certificate"
        },
        {
            "name": "Rahul",
            "gender": "Male",
            "dob": "1988-05-15",
            "phone": "+91 99876 54321",
            "email": "rahul@medibot.com",
            "address": "456, Example Avenue, Sample City, India",
            "staff_id": "STA-8967",
            "role": "Pathologist",
            "department": "Microbiology",
            "employment_type": "Full-time",
            "joining_date": "2025-01-17",
            "experience": "5",
            "shift": "Morning & Evening",
            "working_days": "Mon, Tue, Wed, Thu, Fri, Sat",
            "working_hours": "8:00 AM - 6:00 PM",
            "home_collection": 0,
            "specializations": "Microbiology, Clinical Pathology",
            "emergency_name": "Priya",
            "emergency_relation": "Wife",
            "emergency_phone": "+91 98765 43211",
            "qualification": "PhD, Medical License"
        }
    ]

    print("Seeding staff...")
    query = """
        INSERT INTO lab_staff (
            name, role, status, image_url, qualification,
            staff_id, gender, dob, phone, email, address,
            department, employment_type, joining_date, experience,
            shift, working_days, working_hours, home_collection,
            specializations, emergency_name, emergency_relation, emergency_phone
        ) VALUES (
            %(name)s, %(role)s, 'Available', NULL, %(qualification)s,
            %(staff_id)s, %(gender)s, %(dob)s, %(phone)s, %(email)s, %(address)s,
            %(department)s, %(employment_type)s, %(joining_date)s, %(experience)s,
            %(shift)s, %(working_days)s, %(working_hours)s, %(home_collection)s,
            %(specializations)s, %(emergency_name)s, %(emergency_relation)s, %(emergency_phone)s
        )
    """

    for staff in staff_members:
        try:
            # Check if exists
            cur.execute("SELECT id FROM lab_staff WHERE staff_id = %s", (staff['staff_id'],))
            if cur.fetchone():
                print(f"Staff {staff['name']} ({staff['staff_id']}) already exists. Skipping.")
            else:
                cur.execute(query, staff)
                print(f"Added {staff['name']} ({staff['staff_id']})")
        except Exception as e:
            print(f"Error adding {staff['name']}: {e}")

    conn.commit()
    conn.close()
    print("Done.")

if __name__ == "__main__":
    seed_staff()
