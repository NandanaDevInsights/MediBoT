
import mysql.connector
import os
import json
from dotenv import load_dotenv

load_dotenv()

def check_images():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor(dictionary=True)
    
    print("\n--- PRESCRIPTION FILE PATHS ---")
    cur.execute("SELECT id, mobile_number, file_path, status, image_url FROM prescriptions ORDER BY created_at DESC LIMIT 5")
    rows = cur.fetchall()
    print(json.dumps(rows, indent=2))
    
    # Check filesystem
    print("\n--- FILESYSTEM CHECK ---")
    static_dir = os.path.join(os.getcwd(), "static", "prescriptions")
    if os.path.exists(static_dir):
        files = os.listdir(static_dir)
        print(f"Directory exists: {static_dir}")
        print(f"File count: {len(files)}")
        if files:
            print(f"First 5 files: {files[:5]}")
    else:
        print(f"Directory NOT FOUND: {static_dir}")
        
    conn.close()

if __name__ == "__main__":
    check_images()
