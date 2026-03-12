import os
import sys

# Add server/backend to sys.path to import db_connect
sys.path.append(os.path.abspath('server/backend'))

from db_connect import get_connection

def check_columns():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DESCRIBE reports")
        cols = cur.fetchall()
        with open('reports_cols_v2.txt', 'w', encoding='utf-8') as f:
            for col in cols:
                f.write(str(col) + '\n')
        cur.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    check_columns()
