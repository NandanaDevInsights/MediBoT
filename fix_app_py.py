
import re

with open(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 'users' (not part of 'app_users') with 'app_users'
# Using boundary \b to ensure we match the word exactly
# Use negative lookbehind (?<!app_)
new_content = re.sub(r'(?<!app_)users\b', 'app_users', content)

with open(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\app.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replaced 'users' with 'app_users' globally in app.py (where appropriate).")
