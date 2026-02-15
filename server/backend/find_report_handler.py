
import re

file_path = r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\app.py'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for i, line in enumerate(lines):
        if '/api/admin/reports' in line or 'upload-report' in line:
            print(f"Line {i+1}: {line.strip()}")
            
except Exception as e:
    print(f"Error: {e}")
