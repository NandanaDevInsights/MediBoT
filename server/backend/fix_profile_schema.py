
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def fix_schema():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cursor = conn.cursor()
    
    print("Modifying profile_pic_url to LONGTEXT...")
    try:
        # Increase size for Base64 images
        cursor.execute("ALTER TABLE user_profiles MODIFY profile_pic_url LONGTEXT")
        print("Success: profile_pic_url is now LONGTEXT.")
    except Exception as e:
        print(f"Error modifying column: {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    fix_schema()
