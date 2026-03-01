from db_connect import get_connection
import json

try:
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    query = """
        SELECT 
            COALESCE(p.display_name, u.username, u.email) as name, 
            u.role, 
            u.email, 
            u.created_at as date 
        FROM users u
        LEFT JOIN user_profile p ON u.id = p.user_id
        
        UNION ALL
        
        SELECT 
            email as name, 
            role, 
            email, 
            created_at as date 
        FROM lab_admin_users
        
        ORDER BY date DESC
    """
    cur.execute(query)
    rows = cur.fetchall()
    print(f"Count: {len(rows)}")
    print(json.dumps(rows, indent=2, default=str))
    conn.close()
except Exception as e:
    print(f"Error: {e}")
