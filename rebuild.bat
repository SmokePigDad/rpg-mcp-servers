@echo off
echo Rebuilding RPG MCP Servers after fixes...
echo.

echo Building Game State Server...
cd game-state-server
call npm run build
echo.

echo Building Combat Engine Server...
cd ../combat-engine-server
call npm run build
echo.

cd ..
echo Build complete!
pause
