
import psutil
import os
import signal

def kill_port_5000():
    print("Checking port 5000...")
    killed = False
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            for conn in proc.connections(kind='inet'):
                if conn.laddr.port == 5000:
                    print(f"Found process on port 5000: PID={proc.pid}, Name={proc.name()}")
                    print(f"Cmdline: {proc.cmdline()}")
                    proc.kill()
                    print(f"Killed PID {proc.pid}")
                    killed = True
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    
    if not killed:
        print("No process found on port 5000.")

if __name__ == "__main__":
    kill_port_5000()
