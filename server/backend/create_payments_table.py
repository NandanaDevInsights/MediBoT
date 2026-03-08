
from db_connect import get_connection
import os
from dotenv import load_dotenv

load_dotenv()

def create_payments_table():
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Check if table exists
        cur.execute("SHOW TABLES LIKE 'payments'")
        if cur.fetchone():
            print("Payments table already exists.")
            return

        create_query = """
        CREATE TABLE IF NOT EXISTS payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            order_id VARCHAR(100),
            payment_id VARCHAR(100),
            signature VARCHAR(255),
            amount DECIMAL(10, 2),
            currency VARCHAR(10) DEFAULT 'INR',
            lab_name VARCHAR(255),
            patient_name VARCHAR(255),
            tests TEXT,
            appointment_date VARCHAR(20),
            appointment_time VARCHAR(20),
            status VARCHAR(20) DEFAULT 'Paid',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
        cur.execute(create_query)
        conn.commit()
        print("Payments table created successfully.")
        
    except Exception as e:
        print(f"Error creating payments table: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    create_payments_table()
