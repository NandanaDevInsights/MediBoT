import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "medibot")
    )

staff_images = {
    'Anil Kumar': '/staff/anil.png',
    'Sneha Menon': '/staff/sneha.png',
    'Rahul Das': '/staff/rahul_das.png',
    'Priya Nair': '/staff/priya.png',
    'Vivek S': '/staff/vivek.png',
    'Sarah': '/staff/staff_sarah.png',
    'Rahul': '/staff/staff_rahul.png'
}

try:
    conn = get_connection()
    cur = conn.cursor()
    
    # Update only if they exist
    for name, url in staff_images.items():
        cur.execute("UPDATE lab_staff SET image_url = %s WHERE name = %s", (url, name))
        print(f"Updated {name} with {url}")
        
    conn.commit()
    conn.close()
    print("Database images restored successfully")
except Exception as e:
    print(f"Error: {e}")
