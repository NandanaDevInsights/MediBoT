import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def init_db():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("Checking tables...")
        
        # Create users table (if not exists)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255),
            provider ENUM('password','google') NOT NULL DEFAULT 'password',
            role ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        
        # Create password_resets table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS password_resets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token_hash VARCHAR(64) NOT NULL,
            expires_at DATETIME NOT NULL,
            used TINYINT(1) DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        # Create prescriptions table (for WhatsApp uploads)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS prescriptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            mobile_number VARCHAR(20),
            file_path TEXT NOT NULL,
            file_type VARCHAR(50) DEFAULT 'image',
            extracted_text TEXT,
            test_type VARCHAR(100),
            status ENUM('pending','reviewed','completed') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        
        # Check and add columns if they don't exist (migrations)
        # This is a simple migration approach for development
        cols = {
            "mobile_number": "VARCHAR(20)",
            "extracted_text": "TEXT",
            "test_type": "VARCHAR(100)",
            "file_path": "TEXT",
            "user_id": "INT"
        }
        for col, dtype in cols.items():
            try:
                cur.execute(f"SELECT {col} FROM prescriptions LIMIT 1")
                cur.fetchall()
            except Exception:
                # Column likely missing
                try:
                    cur.execute(f"ALTER TABLE prescriptions ADD COLUMN {col} {dtype}")
                    print(f"Added column {col} to prescriptions")
                except Exception as e:
                    print(f"Could not add column {col}: {e}")

        # Create laboratories table (Auto-created from OSM data)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS laboratories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address TEXT,
            location VARCHAR(255),
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_lab (name, latitude, longitude) 
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        print("Tables validated/created successfully.")
        # Create appointments table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            lab_id INT, 
            patient_name VARCHAR(255),
            doctor_name VARCHAR(255),
            test_type VARCHAR(255),
            appointment_date DATE,
            appointment_time TIME,
            status VARCHAR(50) DEFAULT 'Pending',
            location VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY (lab_id) REFERENCES laboratories(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        # Add lab_id to appointments if missing
        try:
            cur.execute("SHOW COLUMNS FROM appointments LIKE 'lab_id'")
            if not cur.fetchone():
                print("Adding lab_id to appointments...")
                cur.execute("ALTER TABLE appointments ADD COLUMN lab_id INT")
                cur.execute("ALTER TABLE appointments ADD CONSTRAINT fk_appt_lab FOREIGN KEY (lab_id) REFERENCES laboratories(id) ON DELETE SET NULL")
        except Exception as e:
            print(f"Could not add lab_id: {e}")

        # Create lab_staff table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS lab_staff (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(100),
            status VARCHAR(50) DEFAULT 'Available',
            image_url TEXT,
            qualification TEXT,
            certificate_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        # Create reports table
        # Linking to prescriptions (test orders) or users directly
        cur.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            patient_id INT,
            test_name VARCHAR(255),
            file_path TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'Uploaded',
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        # Create lab_admin_profile table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS lab_admin_profile (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNIQUE,
            lab_name VARCHAR(255),
            address TEXT,
            contact_number VARCHAR(50),
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        print("Extended Tables validated/created successfully.")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database Initialization Failed: {e}")

if __name__ == "__main__":
    init_db()
