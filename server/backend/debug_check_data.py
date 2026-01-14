from app import get_connection

def check_data():
    conn = get_connection()
    try:
        cur = conn.cursor()
        print("--- USER PROFILES ---")
        cur.execute("SELECT user_id, contact_number FROM user_profiles")
        for row in cur.fetchall():
            print(f"UID:{row[0]}|Contact:{row[1]}")

        print("\n--- GUESTS ---")
        cur.execute("SELECT distinct mobile_number FROM prescriptions WHERE user_id IS NULL")
        for row in cur.fetchall():
            print(f"Mobile:{row[0]}")

    finally:
        conn.close()

if __name__ == "__main__":
    check_data()
