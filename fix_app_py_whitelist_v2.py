
import re

with open(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 'lab_admin_users' with 'lab_admin_app_users'
new_content = content.replace('lab_admin_users', 'lab_admin_app_users')

with open(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\app.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replaced 'lab_admin_users' with 'lab_admin_app_users' in app.py.")
