
import os

print("Cleaning app.py...")

lines = []
found = False
with open('app.py', 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if "if __name__ == '__main__':" in line:
            found = True
            break
        lines.append(line)

new_code = """
@app.post("/api/bookings")
def create_user_booking():
    session_user_id = session.get("user_id")
    data = request.get_json(silent=True) or {}
    
    # Validation
    if not session_user_id:
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

        query = \"\"\"
            INSERT INTO appointments 
            (user_id, patient_name, lab_name, appointment_date, appointment_time, tests, location, status, payment_status, source, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'Pending', %s, 'Online', NOW())
        \"\"\"
        
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

if __name__ == '__main__':
    print(" * MediBot Python Backend Starting on Port 5000 *")
    print(" * MediBot Backend V3 - Robust Chat Fallback Active *")
    ensure_prescription_table()
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
"""

with open('app.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)
    f.write(new_code)

print("Cleaned and updated app.py")
