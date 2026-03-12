import sqlite3
import os

db_path = os.path.join('server', 'backend', 'medibot.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Schema for lab_feedback:")
cursor.execute("PRAGMA table_info(lab_feedback)")
for col in cursor.fetchall():
    print(col)

print("\nSchema for notifications:")
cursor.execute("PRAGMA table_info(notifications)")
for col in cursor.fetchall():
    print(col)

conn.close()
