# Start both Frontend and Backend servers

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Travellr - Starting Both Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the main directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "Error: Please run this script from the main travellr directory" -ForegroundColor Red
    exit 1
}

# Start Backend
Write-Host "[1/2] Starting Backend (Port 5000)..." -ForegroundColor Green
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/k cd backend && npm start"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "[2/2] Starting Frontend (Port 3000)..." -ForegroundColor Green
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/k cd frontend && npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Services Started!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Note: Services are running in background processes." -ForegroundColor Gray
Write-Host ""
