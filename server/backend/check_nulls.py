
import os

files_to_check = ['app.py', '.env']

for filename in files_to_check:
    if os.path.exists(filename):
        try:
            with open(filename, 'rb') as f:
                content = f.read()
                if b'\x00' in content:
                    print(f"FAIL: {filename} contains null bytes!")
                    # Find position
                    pos = content.find(b'\x00')
                    print(f"First null byte at byte offset: {pos}")
                else:
                    print(f"PASS: {filename} is clean.")
        except Exception as e:
            print(f"Error reading {filename}: {e}")
    else:
        print(f"File not found: {filename}")
