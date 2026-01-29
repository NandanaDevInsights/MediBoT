
import os

filename = 'app.py'

if os.path.exists(filename):
    try:
        with open(filename, 'rb') as f:
            content = f.read()
        
        if b'\x00' in content:
            print(f"Null bytes found in {filename}. cleaning...")
            new_content = content.replace(b'\x00', b'')
            
            with open(filename, 'wb') as f:
                f.write(new_content)
            print("Successfully removed null bytes.")
        else:
            print(f"{filename} is already clean.")
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")
else:
    print(f"File not found: {filename}")
