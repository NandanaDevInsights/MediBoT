
import re

with open(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\app.py', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    r'\blab_admin_app_users\b': 'mb_lab_admin_whitelist',
    r'\bapp_users\b': 'mb_users',
    r'\bpassword_resets\b': 'mb_password_resets',
    r'\buser_otps\b': 'mb_user_otps',
    r'\blaboratories\b': 'mb_laboratories',
    r'\bprescriptions\b': 'mb_prescriptions',
    r'\bappointments\b': 'mb_appointments',
    r'\blab_staff\b': 'mb_lab_staff',
    r'\breports\b': 'mb_reports',
    r'\blab_admin_profile\b': 'mb_lab_admin_profile',
    r'\bbookings\b': 'mb_bookings',
    r'\bnotifications\b': 'mb_notifications',
    r'\buser_profiles\b': 'mb_user_profiles',
    r'(?<!mb_)users\b': 'mb_users' # Catch any remaining 'users'
}

for pattern, replacement in replacements.items():
    content = re.sub(pattern, replacement, content)

with open(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated app.py with prefixed table names.")
