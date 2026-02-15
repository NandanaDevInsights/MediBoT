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
        if not check_super_admin():
            return jsonify({"message": "Unauthorized"}), 403
            
        conn = get_connection()
        try:
            cur = conn.cursor(dictionary=True)
            cur.execute("""
                SELECT 
                    id, 
                    patient_name as patient, 
                    lab_name as lab, 
                    test_type as test, 
                    location, 
                    appointment_time as time,
                    appointment_date as date,
                    payment_status as payment,
                    status
                FROM appointments
                ORDER BY created_at DESC
                LIMIT 100
            """)
            rows = cur.fetchall()
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
            cur.execute("SELECT username as name, role, email, created_at as date FROM users")
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
            
        # Generates last 7 days chart data
        data = []
        for i in range(6, -1, -1):
            date = datetime.date.today() - datetime.timedelta(days=i)
            day = date.strftime('%a')
            data.append({"name": day, "bookings": 0, "revenue": 0})
            
        return jsonify(data), 200
