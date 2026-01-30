from app import get_connection

def list_admins():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, username, email, role FROM users WHERE role IN ('LAB_ADMIN', 'SUPER_ADMIN')")
        admins = cur.fetchall()
        print("Admins in database:")
        for admin in admins:
            print(f"ID: {admin[0]}, User: {admin[1]}, Email: {admin[2]}, Role: {admin[3]}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    list_admins()
