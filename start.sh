#!/bin/bash
# Start both Frontend and Backend servers

echo ""
echo "========================================"
echo "  Travellr - Starting Both Services"
echo "========================================"
echo ""

# Check if we're in the main directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "Error: Please run this script from the main travellr directory"
    exit 1
fi

# Start Backend in background
echo "[1/2] Starting Backend (Port 5000)..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Frontend in background
echo "[2/2] Starting Frontend (Port 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "  Services Started!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Keep script running and handle cleanup
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
