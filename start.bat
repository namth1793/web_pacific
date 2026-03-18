@echo off
echo ============================================
echo  Web Pacific - Starting Application
echo ============================================
echo.
echo Starting Backend (port 5010)...
start "Backend - Web Pacific" cmd /k "cd backend && npm run dev"

echo Starting Frontend (port 3000)...
start "Frontend - Web Pacific" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo  Services starting...
echo  Backend:  http://localhost:5010
echo  Frontend: http://localhost:3000
echo  API Docs: http://localhost:5010/api/health
echo ============================================
