import os
import mysql.connector
from app import app, get_connection
import secrets

def sync_local_prescriptions():
    """Scan static/prescriptions and ensure they are in the database."""
    print("🔍 Syncing local prescriptions to database...")
    
    # Correct path to prescriptions folder
    script_dir = os.path.dirname(os.path.abspath(__file__))
    presc_dir = os.path.join(script_dir, "static", "prescriptions")
    
    if not os.path.exists(presc_dir):
        print(f"⚠️ Prescriptions directory not found: {presc_dir}")
        return

    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Get existing file paths from DB
        cur.execute("SELECT file_path FROM prescriptions")
        existing_paths = {row[0] for row in cur.fetchall() if row[0]}
        
        files = [f for f in os.listdir(presc_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        new_count = 0
        
        for filename in files:
            # We store the path relative to 'static/' or the full path?
            # Looking at app.py get_user_reports, it just returns 'file_path'.
            # Usually it should be accessible via /static/prescriptions/filename
            # Let's use the format: prescriptions/filename
            db_path = f"prescriptions/{filename}"
            
            if db_path not in existing_paths:
                # Add to DB
                # Unpack: id, user_id, mobile_number, file_path, file_type, extracted_text, test_type, status, created_at, image_url
                cur.execute("""
                    INSERT INTO prescriptions (file_path, file_type, status, test_type)
                    VALUES (%s, %s, %s, %s)
                """, (db_path, "image", "pending", "Sync Upload"))
                new_count += 1
                print(f"  + Added {filename}")
        
        conn.commit()
        print(f"✅ Sync complete. Added {new_count} new records.")
        cur.close()
    except Exception as e:
        print(f"❌ Sync failed: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    # Run sync before starting server
    sync_local_prescriptions()
    
    print("🚀 Starting MediBot Server (OCR Integrated)...")
    app.run(host="0.0.0.0", port=5000, debug=True)