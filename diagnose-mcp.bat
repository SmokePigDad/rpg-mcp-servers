@echo off
echo ===========================================
echo MCP Server Diagnostic Tool
echo ===========================================
echo.

echo 1. Checking Node.js version...
node --version
echo.

echo 2. Checking if dist files exist...
if exist "game-state-server\dist\index.js" (
    echo ✓ Game State Server dist/index.js exists
) else (
    echo ✗ Game State Server dist/index.js missing
)

if exist "combat-engine-server\dist\index.js" (
    echo ✓ Combat Engine Server dist/index.js exists
) else (
    echo ✗ Combat Engine Server dist/index.js missing
)
echo.

echo 3. Testing Game State Server startup...
cd game-state-server
echo Starting server with 5 second timeout...
timeout /t 5 /nobreak | node dist/index.js
if %ERRORLEVEL% EQU 0 (
    echo ✓ Game State Server started successfully
) else (
    echo ✗ Game State Server failed with error code %ERRORLEVEL%
)
cd ..
echo.

echo 4. Testing Combat Engine Server startup...
cd combat-engine-server
echo Starting server with 5 second timeout...
timeout /t 5 /nobreak | node dist/index.js
if %ERRORLEVEL% EQU 0 (
    echo ✓ Combat Engine Server started successfully
) else (
    echo ✗ Combat Engine Server failed with error code %ERRORLEVEL%
)
cd ..
echo.

echo 5. Checking MCP configuration...
if exist ".kilocode\mcp.json" (
    echo ✓ .kilocode\mcp.json exists
    echo Content preview:
    type .kilocode\mcp.json | findstr /n "rpg-game-state\|rpg-combat-engine\|enabled"
) else (
    echo ✗ .kilocode\mcp.json missing
)
echo.

echo ===========================================
echo Diagnostic complete. Press any key to exit.
pause >nul
