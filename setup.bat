@echo off
echo Setting up RPG MCP Servers...
echo.

echo Installing Game State Server dependencies...
cd game-state-server
call npm install
call npm run build
echo Game State Server ready!
echo.

echo Installing Combat Engine Server dependencies...
cd ../combat-engine-server
call npm install
call npm run build
echo Combat Engine Server ready!
echo.

cd ..
echo.
echo Setup complete! The servers are ready to use.
echo.
echo To use the AI Dungeon Master mode:
echo 1. Open Roo Code
echo 2. Go to Prompts tab (icon in top menu)
echo 3. Click "Create New Mode" 
echo 4. Import the settings from dungeon-master-mode.json
echo.
echo Or ask Roo to create the custom mode for you!
echo.
pause
