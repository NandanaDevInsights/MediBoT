
@app.post("/api/bookings")
def create_user_booking():
    session_user_id = session.get("user_id")
    data = request.get_json(silent=True) or {}
    
    # Validation
    if not session_user_id:
        # Check if we can recover from username in payload if trusted (less secure but handles edge case)
        # But standard way is session.
        # Given we just fixed login, session should be valid.
        return jsonify({"message": "Please log in to book."}), 401
    
    user_id = session_user_id
    
    lab_name = data.get("labName")
    location = data.get("labLocation")
    tests = data.get("tests")
    date_str = data.get("date")
    time_str = data.get("time")
    payment_method = data.get("paymentMethod")
    total_amount = data.get("totalAmount")
    
    if not all([lab_name, date_str, time_str, tests]):
         return jsonify({"message": "Missing required booking details"}), 400

    tests_str = ", ".join(tests) if isinstance(tests, list) else str(tests)
    
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Get Patient Name
        cur.execute("SELECT up.display_name, u.email, u.username FROM users u LEFT JOIN user_profile up ON u.id = up.user_id WHERE u.id=%s", (user_id,))
        row = cur.fetchone()
        patient_name = "Guest"
        if row:
             dvar, evar, uvar = row
             patient_name = dvar if dvar else (uvar if uvar else evar.split('@')[0])

        # Determine Payment Status
        payment_status = 'Pending'
        if payment_method and payment_method.lower() == 'online':
             payment_status = 'Paid'

        # Insert
        query = """
            INSERT INTO appointments 
            (user_id, patient_name, lab_name, appointment_date, appointment_time, tests, location, status, payment_status, source, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'Pending', %s, 'Online', NOW())
        """
        
        cur.execute(query, (user_id, patient_name, lab_name, date_str, time_str, tests_str, location, payment_status))
        conn.commit()
        new_id = cur.lastrowid
        cur.close()
        
        return jsonify({"message": "Booking Confirmed", "bookingId": new_id}), 201
        
    except Exception as e:
        print(f"Booking Error: {e}")
        return jsonify({"message": "Failed to create booking."}), 500
    finally:
        conn.close()
