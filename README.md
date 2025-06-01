# RPG MCP Servers for Roo Code AI Dungeon

This project implements MCP (Model Context Protocol) servers for creating an AI Dungeon-style RPG experience in Roo Code.

## 🎲 Latest Updates

- **Fixed dice notation**: Now supports `2d20kh1` (advantage) and `2d20kl1` (disadvantage)
- **Added `roll_check` tool**: Simplified ability/skill checks
- **Enhanced inventory**: Added `remove_item` and `update_item` tools
- **Corrected advantage/disadvantage**: Properly implements D&D 5e rules

See `update-summary.md` for full details.

## Project Structure

- **game-state-server/**: SQLite-based persistent game state management
- **combat-engine-server/**: D&D-style combat mechanics and dice rolling

## Prerequisites

Before you begin, ensure you have Roo Code installed and configured in your VS Code environment. Roo Code is the AI-powered coding assistant that will interact with these MCP servers.

-   **Install Roo Code**:
    -   From the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=RooVeterinaryInc.roo-cline).
    -   Or via CLI: `code --install-extension RooVeterinaryInc.roo-cline`
-   **Configure AI Provider**: After installation, add your AI model API keys (e.g., OpenAI, Anthropic) in the Roo Code extension settings.
-   For more details on Roo Code, visit the [Roo Code website](https://roocode.com) or the [official documentation](https://docs.roocode.com).

## Setup Instructions

1. **Install dependencies** for both servers:
   ```bash
   cd game-state-server
   npm install
   npm run build
   
   cd ../combat-engine-server
   npm install
   npm run build
   ```

2. **Configure MCP Servers**:
   Each server can be configured via environment variables or a `.env` file in its respective directory.

   - **game-state-server**:
     - `DATABASE_PATH`: Path to the SQLite database file (e.g., `./data/game.db`). Default is `./data/game.db`.
     - `PORT`: Port for the server to listen on (e.g., `3001`). Default is `3001`.

   - **combat-engine-server**:
     - `PORT`: Port for the server to listen on (e.g., `3002`). Default is `3002`.

   Example `.env` file for `game-state-server`:
   ```
   DATABASE_PATH=./data/my_game.db
   PORT=3001
   ```

3. **Start the MCP Servers**:
   To run the servers, navigate to their respective directories and use `npm start` or `node dist/index.js`.
   For example:
   ```bash
   cd game-state-server
   npm start
   # In a new terminal:
   cd ../combat-engine-server
   npm start
   ```

4. **Roo Code Integration**:
   To use these servers with Roo Code, you need to configure them in your `mcp_settings.json` file. This file is typically located at `C:\Users\YOUR_USERNAME\AppData\Roaming\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\mcp_settings.json`.

   Below are example configurations for each server. Adjust the `cwd` (current working directory) path to where you have cloned or placed the `rpg-mcp-servers` repository and built the servers.

   ```json
   {
     "mcpServers": {
       // ... other servers ...

       "rpg-game-state": {
         "name": "rpg-game-state-server",
         "command": "node",
         "args": [
           "dist/index.js"
         ],
         "cwd": "PATH_TO_YOUR_PROJECT/rpg-mcp-servers/game-state-server",
         "enabled": true,
         "alwaysAllow": [
           "create_character",
           "get_character",
           "get_character_by_name",
           "list_characters",
           "update_character",
           "add_item",
           "get_inventory",
           "save_world_state",
           "get_world_state"
         ]
       },
       "rpg-combat-engine": {
         "name": "rpg-combat-engine-server",
         "command": "node",
         "args": [
           "dist/index.js"
         ],
         "cwd": "PATH_TO_YOUR_PROJECT/rpg-mcp-servers/combat-engine-server",
         "enabled": true,
         "alwaysAllow": [
           "roll_dice",
           "attack_roll",
           "damage_roll",
           "saving_throw",
           "get_combat_log",
           "start_combat"
         ]
       }
       // ... other servers ...
     }
   }
   ```
   **Note**:
   - Replace `PATH_TO_YOUR_PROJECT` with the actual absolute path to the `rpg-mcp-servers` directory on your system. For example, if you cloned it to `C:\projects\rpg-mcp-servers`, then `cwd` for `game-state-server` would be `C:/projects/rpg-mcp-servers/game-state-server`.
   - The `alwaysAllow` arrays list tools that Roo Code can use without explicit user permission each time. You can customize this list.
   - The `start_combat` tool was present in your `mcp_settings.json` for `rpg-combat-engine-server` and has been added to this example. Ensure this tool is actually implemented in the server.

5. **Create a custom mode** for the AI Dungeon Master (e.g., using a `dungeon-master-mode.json` configuration within the [AI Dungeon Experiment](https://github.com/Mnehmos/AI-Dungeon-Experiment) repository) to interact with these servers through Roo.

## Usage

Once setup is complete, you can:
- Create new characters
- Manage inventory
- Run combat encounters
- Track story progress
- All with persistent state across sessions!

## Key Features

- **Persistent State**: Game data stored in SQLite database
- **Combat Engine**: Full D20 system implementation
- **Separation of Concerns**: Narrative (AI) vs Mechanics (MCP servers)
- **Extensible**: Easy to add new features

