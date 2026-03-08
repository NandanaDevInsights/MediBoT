import json
from flask import session
from app import app, get_all_reports

with app.test_request_context('/'):
    # manually set session instead of test_client
    session['user_id'] = 2   # A known LAB_ADMIN user? Wait, let's query a user.
    session['role'] = 'LAB_ADMIN'
    
    # Let's get a real lab admin user id
    from app import get_connection
    c = get_connection()
    cur = c.cursor(dictionary=True)
    cur.execute("SELECT user_id FROM lab_admin_profile LIMIT 1")
    user = cur.fetchone()
    if user:
        session['user_id'] = user['user_id']
        print("Using LAB_ADMIN user_id:", user['user_id'])
        res = get_all_reports()
        print(res[0].get_json() if isinstance(res, tuple) else res.get_json())
    else:
        print("No lab admin found.")
    c.close()

