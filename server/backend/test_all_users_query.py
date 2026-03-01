import requests

def test_all_users():
    # We need a session with role=SUPER_ADMIN to call this
    # But for debugging, I can just look at what the DB returns
    from db_connect import get_connection
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
    print(f"Total rows: {len(rows)}")
    for row in rows:
        print(row)
    conn.close()

if __name__ == "__main__":
    test_all_users()
