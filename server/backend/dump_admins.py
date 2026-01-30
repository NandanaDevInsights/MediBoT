from app import get_connection

def list_admins():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, username, email, role FROM users WHERE role IN ('LAB_ADMIN', 'SUPER_ADMIN')")
        admins = cur.fetchall()
        with open('admin_list.txt', 'w') as f:
            f.write("Admins in database:\n")
            for admin in admins:
                f.write(f"ID: {admin[0]}, User: {admin[1]}, Email: {admin[2]}, Role: {admin[3]}\n")
        print("Success: admin_list.txt created")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    list_admins()
