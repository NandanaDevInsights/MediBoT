import os

file_path = 'app.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """        # Insert into reports table
        # Status 'Completed' makes it show up in 'Lab Results' generated tab
        cur.execute(\"\"\"
            INSERT INTO reports (patient_id, patient_name, test_name, file_path, status, lab_id, lab_name, uploaded_at)
            VALUES (%s, %s, %s, %s, 'Completed', %s, %s, NOW())
        \"\"\", (patient_id, patient_name, test_name, db_file_path, lab_id, lab_name))
        
        conn.commit()


        # Send WhatsApp Notification (Best Effort)"""

replacement = """        # Insert into reports table
        # Status 'Completed' makes it show up in 'Lab Results' generated tab
        cur.execute(\"\"\"
            INSERT INTO reports (patient_id, patient_name, test_name, file_path, status, lab_id, lab_name, uploaded_at)
            VALUES (%s, %s, %s, %s, 'Completed', %s, %s, NOW())
        \"\"\", (patient_id, patient_name, test_name, db_file_path, lab_id, lab_name))
        
        conn.commit()
        report_id = cur.lastrowid
        
        # Take the pdf from reports table in the database
        cur.execute("SELECT patient_name, test_name, file_path, lab_name, uploaded_at FROM reports WHERE id=%s", (report_id,))
        report_data = cur.fetchone()
        
        date_str = ""
        time_str = ""
        if report_data:
            db_patient_name, db_test_name, db_file, db_lab_name, db_uploaded_at = report_data
            patient_name = db_patient_name or patient_name
            test_name = db_test_name or test_name
            lab_name = db_lab_name or lab_name
            
            # Use uploaded_at timestamp
            if db_uploaded_at:
                date_str = db_uploaded_at.strftime('%d-%b-%Y')
                time_str = db_uploaded_at.strftime('%I:%M %p')
            
            # Format filename to match DB
            if db_file:
                 unique_filename = os.path.basename(db_file)


        # Send WhatsApp Notification (Best Effort)"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success: Replacement made.")
else:
    print("Error: Target not found.")
