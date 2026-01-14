from app import get_connection

def fix_data():
    conn = get_connection()
    try:
        cur = conn.cursor()
        # Correct the typo/mismatch in the user's profile to match the WhatsApp number
        # The WhatsApp number seen is +9198474582 (which results in clean digits 9198474582)
        # We will update User 4 (Nandana) to have this number.
        print("Updating user profile contact to match WhatsApp...")
        cur.execute("UPDATE user_profiles SET contact_number='9198474582' WHERE user_id=4")
        conn.commit()
        print("Updated.")
        
    finally:
        conn.close()

if __name__ == "__main__":
    fix_data()
