from flask import jsonify, session, request
from db_connect import get_connection
import datetime

def register_super_admin_endpoints(app):
    
    def check_super_admin():
        if session.get("role") != "SUPER_ADMIN":
            return False
        return True

    @app.get("/api/super-admin/dashboard-stats")
    def get_dashboard_stats():
        if not check_super_admin():
            return jsonify({"message": "Unauthorized"}), 403
        
        conn = get_connection()
        try:
            cur = conn.cursor(dictionary=True)
            
            # Total Bookings
            cur.execute("SELECT COUNT(*) as count FROM appointments")
            total_bookings = cur.fetchone()['count']
            
            # Active Labs
            cur.execute("SELECT COUNT(*) as count FROM laboratories")
            active_labs = cur.fetchone()['count']
            
            # Total Users
            cur.execute("SELECT COUNT(*) as count FROM users WHERE role = 'USER'")
            total_users = cur.fetchone()['count']
            
            # Revenue (Mock for now or sum of payment if exists)
            # Assuming 'amount' column in appointments or similar
            # For now, let's just count 'Paid' bookings and assign a mock value per booking
            cur.execute("SELECT COUNT(*) as count FROM appointments WHERE payment_status = 'Paid'")
            paid_count = cur.fetchone()['count']
            total_revenue = paid_count * 500 # Example: 500 per paid booking
            
            # Pending Reports
            cur.execute("SELECT COUNT(*) as count FROM appointments WHERE status = 'Pending'")
            pending_count = cur.fetchone()['count']
            
            return jsonify({
                "total_bookings": total_bookings,
                "active_labs": active_labs,
                "total_users": total_users,
                "total_revenue": total_revenue,
                "pending_reports": pending_count,
                "conducted_today": 0 # Placeholder
            }), 200
        except Exception as e:
            print(f"Stats Error: {e}")
            return jsonify({"message": str(e)}), 500
        finally:
            conn.close()

    @app.get("/api/super-admin/labs-performance")
    def get_labs_performance():
        if not check_super_admin():
            return jsonify({"message": "Unauthorized"}), 403
            
        conn = get_connection()
        try:
            cur = conn.cursor(dictionary=True)
            # Join laboratories with appointments to get stats
            query = """
                SELECT 
                    l.id, 
                    l.name, 
                    l.location,
                    l.address,
                    l.working_hours as openingHours,
                    l.tests_config,
                    (SELECT COUNT(*) FROM appointments a WHERE a.lab_name = l.name) as bookings,
                    (SELECT COUNT(*) FROM appointments a WHERE a.lab_name = l.name AND a.status = 'Confirmed') as active,
                    (SELECT COUNT(*) FROM appointments a WHERE a.lab_name = l.name AND a.status = 'Completed') as completed,
                    (SELECT COUNT(*) FROM appointments a WHERE a.lab_name = l.name AND a.status = 'Pending') as pending
                FROM laboratories l
            """
            cur.execute(query)
            labs = cur.fetchall()
            
            # Format revenue (Mocking for now as depends on app logic)
            for lab in labs:
                lab['revenue'] = f"₹{lab['completed'] * 450}"
                lab['status'] = 'Open' # Default
                
            return jsonify(labs), 200
        except Exception as e:
            return jsonify({"message": str(e)}), 500
        finally:
            conn.close()

    @app.get("/api/super-admin/all-bookings")
    def get_all_bookings():
        role = session.get("role")
        print(f"[DEBUG] /api/super-admin/all-bookings requested by role: {role}")
        if not check_super_admin():
            print("[DEBUG] Unauthorized access to bookings.")
            return jsonify({"message": "Unauthorized"}), 403
            
        conn = get_connection()
        try:
            cur = conn.cursor(dictionary=True)
            # Fetch from both appointments and bookings table to be exhaustive
            # Joined with laboratories to get names for the 'bookings' table records
            query = """
                SELECT 
                    CONCAT('APP-', a.id) as id, 
                    a.patient_name as patient, 
                    COALESCE(a.lab_name, l.name, 'External Lab') as lab, 
                    COALESCE(a.tests, a.test_type, 'General Checkup') as test, 
                    COALESCE(a.location, l.location, 'Remote/Home') as location, 
                    CAST(a.appointment_time AS CHAR) as time,
                    CAST(a.appointment_date AS CHAR) as date,
                    a.payment_status as payment,
                    a.status,
                    a.created_at
                FROM appointments a
                LEFT JOIN laboratories l ON a.lab_id = l.id
                ORDER BY a.created_at DESC
                LIMIT 1000
            """
            cur.execute(query)
            rows = cur.fetchall()
            print(f"[DEBUG] Returning {len(rows)} combined records.")
            if len(rows) > 0:
                print(f"[DEBUG] Sample record: {rows[0]}")
            return jsonify(rows), 200
        except Exception as e:
            return jsonify({"message": str(e)}), 500
        finally:
            conn.close()

    @app.get("/api/super-admin/all-users")
    def get_all_users():
        if not check_super_admin():
            return jsonify({"message": "Unauthorized"}), 403
            
        conn = get_connection()
        try:
            cur = conn.cursor(dictionary=True)
            # Combine all logins from 'users' and 'lab_admin_users'
            # We want both lab admins and patients, avoiding duplicates by email.
            query = """
                SELECT * FROM (
                    SELECT 
                        COALESCE(lp.admin_name, up.display_name, ups.display_name, u.username, u.email) as name, 
                        u.role, 
                        u.email, 
                        u.created_at as date 
                    FROM users u
                    LEFT JOIN user_profile up ON u.id = up.user_id
                    LEFT JOIN user_profiles ups ON u.id = ups.user_id
                    LEFT JOIN lab_admin_profile lp ON u.id = lp.user_id
                    
                    UNION ALL
                    
                    SELECT 
                        email as name, 
                        role, 
                        email, 
                        created_at as date 
                    FROM lab_admin_users
                    WHERE email NOT IN (SELECT email FROM users)
                ) as combined
                WHERE role IN ('USER', 'LAB_ADMIN')
                ORDER BY date DESC
            """
            cur.execute(query)
            rows = cur.fetchall()
            return jsonify(rows), 200
        except Exception as e:
            return jsonify({"message": str(e)}), 500
        finally:
            conn.close()

    @app.get("/api/super-admin/chart-data")
    def get_chart_data():
        if not check_super_admin():
            return jsonify({"message": "Unauthorized"}), 403
            
        conn = get_connection()
        try:
            cur = conn.cursor(dictionary=True)
            data = []
            for i in range(6, -1, -1):
                date = datetime.date.today() - datetime.timedelta(days=i)
                date_str = date.strftime('%Y-%m-%d')
                day_name = date.strftime('%a')
                
                # Count bookings for this day
                cur.execute("SELECT COUNT(*) as count FROM appointments WHERE appointment_date = %s", (date_str,))
                bookings = cur.fetchone()['count']
                
                # Revenue (Mocking based on bookings or status)
                cur.execute("SELECT COUNT(*) as count FROM appointments WHERE appointment_date = %s AND payment_status = 'Paid'", (date_str,))
                paid_count = cur.fetchone()['count']
                revenue = paid_count * 500
                
                data.append({"name": day_name, "bookings": bookings, "revenue": revenue, "date": date_str})
                
            return jsonify(data), 200
        except Exception as e:
            print(f"Chart Data Error: {e}")
            return jsonify([])
        finally:
            conn.close()



    @app.get("/api/super-admin/notifications")

    def get_admin_notifications():

        if not check_super_admin():

            return jsonify({"message": "Unauthorized"}), 403

            

        conn = get_connection()

        try:

            cur = conn.cursor(dictionary=True)

            cur.execute("SELECT * FROM admin_notifications ORDER BY created_at DESC LIMIT 50")

            rows = cur.fetchall()

            # Format time for frontend (e.g. "10 mins ago")

            # For now, just return the ISO string

            for row in rows:

                row['created_at'] = row['created_at'].isoformat()

            return jsonify(rows), 200

        except Exception as e:

            return jsonify({"message": str(e)}), 500

        finally:

            conn.close()
