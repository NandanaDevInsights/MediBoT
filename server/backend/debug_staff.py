import mysql.connector
import json

try:
    conn = mysql.connector.connect(host='localhost', user='root', password='', database='medibot')
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM lab_staff')
    rows = cursor.fetchall()
    
    # Save to JSON
    with open('staff_data_full.json', 'w') as f:
        json.dump(rows, f, indent=2, default=str)
    
    print(f"Successfully exported {len(rows)} staff members.")
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals() and conn.is_connected():
        conn.close()
