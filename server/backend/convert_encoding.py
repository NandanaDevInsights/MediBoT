
import os

def convert_utf16_to_utf8(file_path, output_path):
    try:
        with open(file_path, 'r', encoding='utf-16le') as f:
            content = f.read()
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Converted {file_path} to {output_path}")
    except Exception as e:
        print(f"Error converting {file_path}: {e}")

if __name__ == "__main__":
    convert_utf16_to_utf8(r"c:\Users\NANDANA PRAMOD\Documents\MediBot\src\pages\LabAdminDashboard_old.jsx", r"c:\Users\NANDANA PRAMOD\Documents\MediBot\src\pages\LabAdminDashboard_old_utf8.jsx")
