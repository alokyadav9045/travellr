@echo off
REM Start both Frontend and Backend servers

echo.
echo ========================================
echo   Travellr - Starting Both Services
echo ========================================
echo.

REM Start Backend
echo [1/2] Starting Backend (Port 5000)...
start "Travellr Backend" cmd /k "cd backend && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start Frontend
echo [2/2] Starting Frontend (Port 3000)...
start "Travellr Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Services Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close the terminal windows to stop the services.
echo.
