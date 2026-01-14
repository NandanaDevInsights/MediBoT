
@app.get("/api/admin/patients")
def get_patients():
    if session.get("role") not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403
    
    conn = get_connection()
    try:
        cur = conn.cursor()
        # Fetch users who are not admins
        # Get basic info + count of prescriptions + latest prescription
        query = """
            SELECT 
                u.id, 
                u.username, 
                u.email, 
                u.phone_number,
                (SELECT COUNT(*) FROM prescriptions p WHERE p.user_id = u.id) as upload_count,
                (SELECT file_path FROM prescriptions p WHERE p.user_id = u.id ORDER BY created_at DESC LIMIT 1) as latest_rx
            FROM users u
            WHERE u.role NOT IN ('LAB_ADMIN', 'SUPER_ADMIN')
        """
        cur.execute(query)
        rows = cur.fetchall()
        
        patients = []
        for r in rows:
            patients.append({
                "id": r[0],
                "name": r[1],
                "email": r[2],
                "phone": r[3] if r[3] else "N/A",
                "uploaded_data_count": r[4],
                "latest_prescription_url": r[5]
            })
        
        return jsonify(patients), 200
    except Exception as e:
        print(f"Error fetching patients: {e}")
        return jsonify({"message": str(e)}), 500
    finally:
        conn.close()

@app.get("/api/admin/patients/<int:user_id>/history")
def get_patient_history(user_id):
    if session.get("role") not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403
        
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # User Details
        cur.execute("SELECT id, username, email, phone_number FROM users WHERE id = %s", (user_id,))
        user_row = cur.fetchone()
        if not user_row:
            return jsonify({"message": "User not found"}), 404
            
        user_details = {
            "id": user_row[0],
            "name": user_row[1],
            "email": user_row[2],
            "phone": user_row[3]
        }
        
        # Prescriptions (WhatsApp Images)
        cur.execute("""
            SELECT id, file_path, test_type, created_at, status 
            FROM prescriptions 
            WHERE user_id = %s 
            ORDER BY created_at DESC
        """, (user_id,))
        
        prescriptions = []
        for rx in cur.fetchall():
            prescriptions.append({
                "id": rx[0],
                "image_url": rx[1],
                "type": rx[2],
                "date": rx[3].strftime('%Y-%m-%d %H:%M') if rx[3] else "N/A",
                "status": rx[4]
            })
            
        # Appointments History
        cur.execute("""
            SELECT id, test_type, appointment_date, appointment_time, status 
            FROM appointments 
            WHERE user_id = %s 
            ORDER BY appointment_date DESC
        """, (user_id,))
        
        appointments = []
        for appt in cur.fetchall():
            appointments.append({
                "id": appt[0],
                "test": appt[1],
                "date": str(appt[2]),
                "time": str(appt[3]),
                "status": appt[4]
            })
            
        return jsonify({
            "details": user_details,
            "prescriptions": prescriptions,
            "appointments": appointments
        }), 200
        
    except Exception as e:
        print(f"Error fetching history: {e}")
        return jsonify({"message": str(e)}), 500
    finally:
        conn.close()
