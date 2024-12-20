@echo off
start /min cmd /c "cd backend && python server.py"
timeout /t 1 > nul
start /min cmd /c "cd discord-rpc && node app.js"
pause