
import os

env_path = ".env"

if not os.path.exists(env_path):
    print(".env not found!")
    exit(1)

with open(env_path, "r") as f:
    lines = f.readlines()

new_lines = []
tls_found = False
port_587 = False

for line in lines:
    if "SMTP_PORT" in line and "587" in line:
        port_587 = True
    
    if line.strip().startswith("SMTP_USE_TLS"):
        new_lines.append("SMTP_USE_TLS=1\n")
        tls_found = True
    else:
        new_lines.append(line)

if not tls_found:
    new_lines.append("\nSMTP_USE_TLS=1\n")

with open(env_path, "w") as f:
    f.writelines(new_lines)

print("Updated .env with SMTP_USE_TLS=1")
