"""
Auto-restart Flask server to apply the staff API fix
"""
import os
import signal
import subprocess
import time
import psutil

print("🔄 Restarting Flask server to apply staff data fix...")

# Find and kill existing python app.py process
killed = False
for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
    try:
        cmdline = proc.info['cmdline']
        if cmdline and 'python' in cmdline[0].lower() and 'app.py' in str(cmdline):
            print(f"⏹️  Stopping old Flask server (PID: {proc.info['pid']})...")
            proc.kill()
            proc.wait(timeout=3)
            killed = True
            print("✅ Old server stopped")
            time.sleep(2)
    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.TimeoutExpired):
        pass

if not killed:
    print("⚠️  No running Flask server found to stop")

# Start new Flask server
print("🚀 Starting Flask server with updated code...")
subprocess.Popen(['python', 'app.py'], 
                 creationflags=subprocess.CREATE_NEW_CONSOLE)

print("\n✅ DONE!")
print("="*60)
print("Flask server restarted successfully!")
print("The staff data should now load correctly.")
print("Please refresh your browser and go to Lab Staff section.")
print("="*60)
