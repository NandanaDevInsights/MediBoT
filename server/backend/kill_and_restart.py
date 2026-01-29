"""
Kill all Flask/Python processes and start fresh
"""
import subprocess
import time
import sys

print("=" * 80)
print("   STOPPING ALL FLASK INSTANCES")
print("=" * 80)

# Kill all python processes running app.py or OCR.py
try:
    # Windows command to find and kill Python processes
    result = subprocess.run(
        ['tasklist', '/FI', 'IMAGENAME eq python.exe', '/FO', 'CSV'],
        capture_output=True,
        text=True
    )
    
    if 'python.exe' in result.stdout:
        print("\n📋 Found Python processes running")
        print("   Killing all Python instances...")
        
        # Kill all python.exe processes
        subprocess.run(['taskkill', '/F', '/IM', 'python.exe'], 
                      capture_output=True)
        
        print("   ✅ All Python processes stopped")
        time.sleep(2)
    else:
        print("\n   No Python processes found")
        
except Exception as e:
    print(f"   ⚠️  Error: {e}")
    print("   You may need to manually stop Flask (Ctrl+C in terminal)")

print("\n" + "=" * 80)
print("   NOW START THE SERVER")
print("=" * 80)
print("\nRun this command:")
print("   python OCR.py")
print()
print("=" * 80)
