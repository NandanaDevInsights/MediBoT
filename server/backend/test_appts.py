import sys
from app import get_connection

try:
    c = get_connection()
    cursor = c.cursor(dictionary=True)
    cursor.execute('SELECT id, status, lab_id, lab_name, patient_name FROM appointments')
    res = cursor.fetchall()
    for row in res:
        print(row)
    c.close()
except Exception as e:
    print(e)
