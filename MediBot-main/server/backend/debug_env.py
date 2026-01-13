import os
import sys
from dotenv import load_dotenv, find_dotenv

# Force stdout to utf-8 if possible, though we write to file mainly
try:
    sys.stdout.reconfigure(encoding='utf-8')
except:
    pass

load_dotenv(find_dotenv())

with open("debug_result.txt", "w", encoding="utf-8") as f:
    f.write("--- ENV REPORT ---\n")
    host = os.environ.get('SMTP_HOST')
    port = os.environ.get('SMTP_PORT', '465')
    tls = os.environ.get('SMTP_USE_TLS', '0')
    user = os.environ.get('SMTP_USER')
    pw = os.environ.get('SMTP_PASS')
    
    f.write(f"SMTP_HOST=[{host}]\n")
    f.write(f"SMTP_PORT=[{port}]\n")
    f.write(f"SMTP_USE_TLS=[{tls}]\n")
    f.write(f"SMTP_USER=[{user}]\n")
    f.write(f"SMTP_PASS=[{'SET' if pw else 'MISSING'}]\n")
    
    try:
        import app
        conn = app.get_connection()
        cur = conn.cursor()
        cur.execute("SELECT 1")
        f.write("DB_CONNECTION=[OK]\n")
        conn.close()
    except Exception as e:
        f.write(f"DB_CONNECTION=[FAIL] {e}\n")

print("Done.")
