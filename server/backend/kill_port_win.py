
import subprocess
import re
import os

def kill_port_5000_windows():
    try:
        # 1. Find PID
        output = subprocess.check_output("netstat -ano | findstr :5000", shell=True).decode()
        lines = output.strip().split('\n')
        pids = set()
        for line in lines:
            if "LISTENING" in line:
                parts = line.split()
                pid = parts[-1]
                pids.add(pid)
        
        if not pids:
            print("No process on port 5000.")
            return

        # 2. Kill PIDs
        for pid in pids:
            print(f"killing PID {pid}...")
            os.system(f"taskkill /F /PID {pid}")
            print("Killed.")
            
    except subprocess.CalledProcessError:
        print("No process found listening on port 5000.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    kill_port_5000_windows()
