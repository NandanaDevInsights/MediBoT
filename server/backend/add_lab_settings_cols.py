
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def migrate():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("Checking laboratories table for settings columns...")
        
        cols_to_add = {
            "tests_config": "JSON",
            "working_hours": "JSON",
            "working_days": "JSON"
        }
        
        for col, dtype in cols_to_add.items():
            try:
                cur.execute(f"SHOW COLUMNS FROM laboratories LIKE '{col}'")
                if not cur.fetchone():
                    print(f"Adding column {col} to laboratories...")
                    cur.execute(f"ALTER TABLE laboratories ADD COLUMN {col} {dtype}")
                else:
                    print(f"Column {col} already exists.")
            except Exception as e:
                print(f"Error adding {col}: {e}")

        # Also ensure lab_admin_profile has lab_id
        try:
            cur.execute("SHOW COLUMNS FROM lab_admin_profile LIKE 'lab_id'")
            if not cur.fetchone():
                print("Adding lab_id to lab_admin_profile...")
                cur.execute("ALTER TABLE lab_admin_profile ADD COLUMN lab_id INT")
                cur.execute("ALTER TABLE lab_admin_profile ADD CONSTRAINT fk_admin_lab_id FOREIGN KEY (lab_id) REFERENCES laboratories(id) ON DELETE SET NULL")
        except Exception as e:
            print(f"Error adding lab_id to lab_admin_profile: {e}")

        conn.commit()
        cur.close()
        conn.close()
        print("Migration complete.")
        
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
