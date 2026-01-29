@echo off
echo ========================================
echo Restarting Flask Server
echo ========================================
echo.

echo Stopping existing Flask server...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *app.py*" 2>nul
if errorlevel 1 (
    echo No Flask process found to kill
) else (
    echo Flask server stopped
)

timeout /t 2 /nobreak >nul

echo.
echo Starting Flask server with updated code...
start "Flask Server" python app.py

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo DONE! Flask server restarted
echo ========================================
echo.
echo The staff data fix has been applied.
echo Please refresh your browser and navigate to Lab Staff section.
echo.
pause
