import sys
sys.path.append('c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend')
from db_connect import get_connection

def migrate():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SHOW COLUMNS FROM lab_feedback LIKE 'username'")
        if not cur.fetchone():
            print("Adding username column...")
            cur.execute("ALTER TABLE lab_feedback ADD COLUMN username VARCHAR(255) AFTER patient_name")
            cur.execute("UPDATE lab_feedback SET username = LOWER(REPLACE(patient_name, ' ', '_')) WHERE username IS NULL")
            conn.commit()
            print("Done.")
        else:
            print("Username column already exists.")
        cur.close()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
