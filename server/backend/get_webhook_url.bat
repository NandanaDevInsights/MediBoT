@echo off
echo ========================================
echo   QUICK NGROK URL CHECKER
echo ========================================
echo.

curl -s http://localhost:4040/api/tunnels > ngrok_status.json 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo ❌ ngrok is NOT RUNNING!
    echo.
    echo TO START NGROK:
    echo 1. Open a NEW PowerShell window
    echo 2. Run: ngrok http 5000
    echo 3. Keep it running
    goto :end
)

echo ✅ ngrok is running!
echo.
echo Your webhook URL is in ngrok_status.json
echo Run this to see it:
echo python -c "import json; data=json.load(open('ngrok_status.json')); print([t['public_url'] for t in data.get('tunnels',[]) if t.get('proto')=='https'][0] + '/webhook/whatsapp')"

:end
pause
