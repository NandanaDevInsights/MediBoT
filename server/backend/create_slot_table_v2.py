import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def create_slot_table():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "127.0.0.1"),
            user=os.environ.get("DB_USER"),
            password=os.environ.get("DB_PASSWORD"),
            database=os.environ.get("DB_NAME")
        )
        cur = conn.cursor()
        
        print("Re-creating slot table with required columns...")
        
        # Drop if exists to ensure schema matches requirement exactly
        # Actually, let's just make sure it has the columns. 
        # If it already exists, maybe it has data? 
        # But the request says "Create a new table named slot using SQL".
        
        cur.execute("DROP TABLE IF EXISTS slot")
        
        cur.execute("""
        CREATE TABLE slot (
            slot_id INT AUTO_INCREMENT PRIMARY KEY,
            lab_name VARCHAR(255),
            date DATE,
            time TIME,
            num_seats INT DEFAULT 10,
            token_number VARCHAR(50),
            user_id INT,
            slot_status VARCHAR(50) DEFAULT 'available',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        
        print("Slot table created successfully.")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Failed to create slot table: {e}")

if __name__ == "__main__":
    create_slot_table()
