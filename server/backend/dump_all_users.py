from app import get_connection

def list_all_users():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, username, email, role FROM users")
        users = cur.fetchall()
        with open('all_users.txt', 'w') as f:
            f.write("All users in database:\n")
            for user in users:
                f.write(f"ID: {user[0]}, User: {user[1]}, Email: {user[2]}, Role: {user[3]}\n")
        print("Success: all_users.txt created")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    list_all_users()
