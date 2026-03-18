@echo off
echo ============================================
echo  Web Pacific - Installing Dependencies
echo ============================================

echo.
echo [1/2] Installing Backend dependencies...
cd backend && npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend install failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [2/2] Installing Frontend dependencies...
if exist frontend (
    cd frontend && npm install
    if %errorlevel% neq 0 (
        echo ERROR: Frontend install failed!
        pause
        exit /b 1
    )
    cd ..
) else (
    echo INFO: Frontend folder not found, skipping...
)

echo.
echo ============================================
echo  Installation complete!
echo  Run start.bat to launch the application.
echo ============================================
pause
