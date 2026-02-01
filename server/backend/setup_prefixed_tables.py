
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def setup_all_tables():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot_new") # Use the new one
        )
        cur = conn.cursor()
        print("Connected to database. Starting table creation with prefixes...")

        # 1. Users Table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            username VARCHAR(255) UNIQUE,
            password_hash VARCHAR(255),
            provider ENUM('password','google') NOT NULL DEFAULT 'password',
            role ENUM('USER','ADMIN','LAB_ADMIN','SUPER_ADMIN') NOT NULL DEFAULT 'USER',
            pin_code VARCHAR(10),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        print("- mb_users table ensured.")

        # 2. Lab Admin Whitelist
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_lab_admin_whitelist (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        print("- mb_lab_admin_whitelist table ensured.")

        # 3. Password Resets
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_password_resets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token_hash VARCHAR(64) NOT NULL,
            expires_at DATETIME NOT NULL,
            used TINYINT(1) DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES mb_users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        print("- mb_password_resets table ensured.")

        # 4. User OTPs
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_user_otps (
            email VARCHAR(255) PRIMARY KEY,
            otp_code VARCHAR(10) NOT NULL,
            expires_at DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        print("- mb_user_otps table ensured.")

        # 5. Laboratories
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_laboratories (
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
        print("- mb_laboratories table ensured.")

        # 6. Prescriptions
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_prescriptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            mobile_number VARCHAR(20),
            file_path TEXT NOT NULL,
            file_type VARCHAR(50) DEFAULT 'image',
            extracted_text TEXT,
            test_type VARCHAR(100),
            status ENUM('pending','reviewed','completed') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES mb_users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        print("- mb_prescriptions table ensured.")

        # 7. Appointments
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_appointments (
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
            FOREIGN KEY (user_id) REFERENCES mb_users(id) ON DELETE SET NULL,
            FOREIGN KEY (lab_id) REFERENCES mb_laboratories(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        print("- mb_appointments table ensured.")

        # 8. Lab Staff
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_lab_staff (
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
        print("- mb_lab_staff table ensured.")

        # 9. Reports
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            patient_id INT,
            test_name VARCHAR(255),
            file_path TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'Uploaded',
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES mb_users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        print("- mb_reports table ensured.")

        # 10. Lab Admin Profile
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_lab_admin_profile (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNIQUE,
            lab_name VARCHAR(255),
            address TEXT,
            contact_number VARCHAR(50),
            admin_name VARCHAR(255),
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES mb_users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        print("- mb_lab_admin_profile table ensured.")

        # 11. Bookings
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_bookings (
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
            FOREIGN KEY (user_id) REFERENCES mb_users(id) ON DELETE SET NULL,
            FOREIGN KEY (lab_id) REFERENCES mb_laboratories(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        print("- mb_bookings table ensured.")

        # 12. Notifications
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            message TEXT NOT NULL,
            is_read TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES mb_users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        print("- mb_notifications table ensured.")

        # 13. User Profiles
        cur.execute("""
        CREATE TABLE IF NOT EXISTS mb_user_profiles (
            user_id INT PRIMARY KEY,
            display_name VARCHAR(100),
            age INT,
            gender VARCHAR(20),
            blood_group VARCHAR(10),
            contact_number VARCHAR(20),
            address TEXT,
            profile_pic_url TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES mb_users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        print("- mb_user_profiles table ensured.")

        conn.commit()
        cur.close()
        conn.close()
        print("\nAll prefixed tables created successfully.")
    except Exception as e:
        print(f"\nError: {e}")

if __name__ == "__main__":
    setup_all_tables()
