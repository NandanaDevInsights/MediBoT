"""
Quick test - Check if the app.py file has been updated with correct column names
"""
import re

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Check if the correct column names are in the file
if 'staff_id' in content and 'phone_number' in content and 'daily_working_hours' in content:
    print("✅ app.py has been updated with CORRECT column names!")
    print("\n✅ The fix is in place.")
    print("📢 Now you just need to RESTART Flask server to see the changes.")
else:
    print("❌ app.py still has old column names")
    print("The changes might not have been saved properly")

# Show the relevant lines
match = re.search(r'def get_lab_staff.*?SELECT.*?FROM lab_staff', content, re.DOTALL)
if match:
    print("\n" + "="*60)
    print("Current SQL query in app.py:")
    print("="*60)
    lines = match.group(0).split('\n')
    for line in lines[10:20]:  # Show SQL part
        print(line)
    print("="*60)
