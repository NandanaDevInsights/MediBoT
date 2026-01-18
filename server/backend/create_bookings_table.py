import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def create_bookings_table():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("Creating bookings table...")
        
        # Create bookings table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            lab_id INT DEFAULT 1,
            patient_name VARCHAR(255),
            doctor_name VARCHAR(255),
            test_type VARCHAR(255),
            appointment_date DATE,
            appointment_time TIME,
            status VARCHAR(50) DEFAULT 'Pending',
            location VARCHAR(255),
            contact_number VARCHAR(50),
            source VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY (lab_id) REFERENCES laboratories(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        
        print("Bookings table created successfully.")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Failed to create bookings table: {e}")

if __name__ == "__main__":
    create_bookings_table()
