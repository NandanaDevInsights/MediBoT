
import re

with open(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find occurrences of 'users' that are not 'app_users'
# We use negative lookbehind for 'app_'
matches = re.finditer(r'(?<!app_)users\b', content)

with open(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\users_occurrences.txt', 'w') as f:
    for match in matches:
        start = match.start()
        # Find line number
        line_no = content[:start].count('\n') + 1
        line_content = content.split('\n')[line_no-1]
        f.write(f"Line {line_no}: {line_content.strip()}\n")
