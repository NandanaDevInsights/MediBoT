
from db_connect import get_connection

def list_tables():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SHOW TABLES")
    tables = [row[0] for row in cur.fetchall()]
    print("Tables Found:", tables)
    
    if "app_users" in tables:
        cur.execute("SELECT COUNT(*) FROM app_users")
        print("app_users count:", cur.fetchone()[0])
        
    if "users" in tables:
        cur.execute("SELECT COUNT(*) FROM users")
        print("users count:", cur.fetchone()[0])
        
    if "lab_admin_users" in tables:
       cur.execute("SELECT COUNT(*) FROM lab_admin_users")
       print("lab_admin_users count:", cur.fetchone()[0])

    conn.close()

if __name__ == "__main__":
    list_tables()
