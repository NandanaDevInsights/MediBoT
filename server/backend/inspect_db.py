import os
import mysql.connector
from dotenv import load_dotenv
import json

def get_schema():
    load_dotenv()
    conn = mysql.connector.connect(
        host=os.environ.get('DB_HOST'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        database=os.environ.get('DB_NAME')
    )
    cur = conn.cursor(dictionary=True)
    
    tables = [
        'laboratories', 
        'appointments', 
        'users', 
        'reports', 
        'lab_feedback'
    ]
    
    schema_info = {}
    
    for table in tables:
        try:
            cur.execute(f"DESCRIBE {table}")
            schema_info[table] = {
                'columns': cur.fetchall(),
                'count': 0
            }
            cur.execute(f"SELECT COUNT(*) as count FROM {table}")
            schema_info[table]['count'] = cur.fetchone()['count']
        except Exception as e:
            schema_info[table] = {'error': str(e)}
            
    print(json.dumps(schema_info, indent=2))
    cur.close()
    conn.close()

if __name__ == "__main__":
    get_schema()
