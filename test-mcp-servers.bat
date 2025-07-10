@echo off
echo Testing MCP Servers...
echo.

echo Testing Game State Server...
cd game-state-server
timeout /t 2 /nobreak >nul
node dist/index.js &
set GAME_STATE_PID=%!
echo Game State Server started (PID: %GAME_STATE_PID%)

echo.
echo Testing Combat Engine Server...
cd ..\combat-engine-server
timeout /t 2 /nobreak >nul
node dist/index.js &
set COMBAT_ENGINE_PID=%!
echo Combat Engine Server started (PID: %COMBAT_ENGINE_PID%)

echo.
echo Both servers are running. Press any key to stop them...
pause >nul

echo Stopping servers...
taskkill /PID %GAME_STATE_PID% /F >nul 2>&1
taskkill /PID %COMBAT_ENGINE_PID% /F >nul 2>&1
echo Servers stopped.
