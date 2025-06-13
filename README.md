# 🎯 RPG MCP Servers - Advanced D&D 5e Combat & Game State Management

**The most advanced MCP server suite for AI-powered D&D experiences!** Features 3D spatial combat, ASCII battlefield visualization, and complete character management.

## 🚀 **Latest Major Updates**

### 🗺️ **NEW: ASCII Battlefield Visualization**
```
📍 **BATTLEFIELD MAP** (X→, Y↓):

 0│· · · · · · · · · · · · · · · 
 1│· · · · · · · · · · · · · · · 
 2│· · · · · · · · █ · · · · · · 
 3│· · · · · · · · █ · · · · · · 
 4│· · · · · ≡ ≡ · █ · · · · · · 
 5│· · · · · ≡ L · █ · · · · · · 
 6│· · · K · · · · · · · · · · · 
 7│· · · · · · · · · · · · · · · 
 8│· · · · · · · · · · · · S · · 
 9│· · · · · · · · · · · · · · · 
  └0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 

**LEGEND**: █=wall, ■=pillar, ≡=stairs, Letters=creatures
```

### ⚔️ **NEW: 3D Spatial Combat Engine**
- **Elevation System**: Stairs, pillars, flying creatures
- **Line of Sight**: Ray-casting with cover calculation  
- **Opportunity Attacks**: Movement validation
- **Flanking Detection**: Tactical positioning bonuses
- **Area Effect Targeting**: Spell geometry and targeting

### 🧠 **NEW: Human-Readable Tactical Intelligence**
```
🎯 **Lyra Swiftarrow** is standing on stairs at coordinates (6,5,5).

⚔️ **ENEMIES IN SIGHT**: 
  Kael Ironshield (25ft close) - clear shot, 
  Stone Gargoyle (38ft medium) - clear shot

🏃 **MOVEMENT OPTIONS**: pillar (32ft away), wall (12ft away)
```

### 🔧 **Enhanced Features**
- **Fixed dice notation**: `2d20kh1` (advantage) and `2d20kl1` (disadvantage)
- **Complete turn management**: Actions, bonus actions, movement, reactions
- **Enhanced inventory**: Full item management with equipped status
- **Monster/NPC system**: Template-based creature creation
- **Story & Quest management**: Progress tracking and objectives
- **Bug fixes**: Battlefield initialization now preserves creatures

## 🏗️ **Project Architecture**

- **game-state-server/**: SQLite-based persistent character sheets, inventory, encounters
- **combat-engine-server/**: Advanced 3D spatial combat with D&D 5e mechanics

## 🎮 **Key Features**

### 📊 **Complete Character Management**
- **Character Sheets**: Full D&D 5e stats (STR, DEX, CON, INT, WIS, CHA)
- **Inventory System**: Items, equipment, quantities, equipped status
- **World State**: Location tracking, NPC relationships, environmental data
- **Story Progress**: Chapter/checkpoint tracking with narrative summaries

### ⚔️ **Advanced Combat System**
- **3D Battlefield**: X, Y, Z positioning with terrain features
- **Turn Management**: Initiative order, action economy tracking
- **Spatial Intelligence**: Distance calculation, movement validation
- **Tactical Analysis**: Flanking, cover, height advantage detection
- **Visual Combat Maps**: ASCII battlefield visualization

### 🎲 **D&D 5e Mechanics**
- **Complete Dice System**: All standard dice with advantage/disadvantage
- **Combat Actions**: Attack rolls, damage, saving throws, spell effects
- **Movement Rules**: Speed limits, opportunity attacks, difficult terrain
- **Area Effects**: Spells with proper geometry (spheres, cones, lines)

## 🛠️ **Prerequisites**

**Roo Code Installation Required:**
- Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=RooVeterinaryInc.roo-cline)
- Or via CLI: `code --install-extension RooVeterinaryInc.roo-cline`
- Configure AI provider (OpenAI, Anthropic, etc.)
- Visit [Roo Code docs](https://docs.roocode.com) for setup details

## 🚀 **Quick Setup**

### 1. **Install & Build Servers**
```bash
# Game State Server
cd game-state-server
npm install && npm run build

# Combat Engine Server  
cd ../combat-engine-server
npm install && npm run build
```

### 2. **Configure Environment** (Optional)
Create `.env` files in each server directory:

**game-state-server/.env:**
```
DATABASE_PATH=./data/my_rpg.db
PORT=3001
```

**combat-engine-server/.env:**
```
PORT=3002
```

### 3. **Start Servers**
```bash
# Terminal 1
cd game-state-server && npm start

# Terminal 2  
cd combat-engine-server && npm start
```

### 4. **Configure Roo Code MCP Settings**

Add to your `mcp_settings.json` (typically at `%APPDATA%\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\mcp_settings.json`):

```json
{
  "mcpServers": {
    "rpg-game-state": {
      "name": "rpg-game-state-server",
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "PATH_TO_YOUR_PROJECT/rpg-mcp-servers/game-state-server",
      "enabled": true,
      "alwaysAllow": [
        "create_character", "get_character", "get_character_by_name", "list_characters", "update_character",
        "add_item", "get_inventory", "remove_item", "update_item",
        "save_world_state", "get_world_state", "update_world_state",
        "create_npc", "create_npc_group", "get_npc", "list_npcs", "update_npc", "remove_npc",
        "create_encounter", "add_to_encounter", "get_encounter_state", "get_active_encounter",
        "start_turn", "end_turn", "next_turn", "consume_action", "end_encounter", "apply_damage",
        "save_story_progress", "add_quest", "get_active_quests", "update_quest_state", "assign_quest_to_character"
      ]
    },
    "rpg-combat-engine": {
      "name": "rpg-combat-engine-server", 
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "PATH_TO_YOUR_PROJECT/rpg-mcp-servers/combat-engine-server",
      "enabled": true,
      "alwaysAllow": [
        "roll_dice", "roll_check", "attack_roll", "initiative_roll", "damage_roll", "saving_throw",
        "use_reaction", "use_legendary_action", "trigger_lair_action", "execute_multiattack",
        "initialize_battlefield", "place_creature", "move_creature", "check_line_of_sight",
        "get_area_effect_targets", "get_tactical_summary", "check_flanking", "check_height_advantage",
        "describe_battlefield", "describe_detailed_tactical_situation", "generate_battlefield_map",
        "get_combat_log", "clear_combat_log"
      ]
    }
  }
}
```

**📝 Note**: Replace `PATH_TO_YOUR_PROJECT` with your actual path (e.g., `C:/projects/rpg-mcp-servers`).

## 🎯 **Usage Examples**

### **Create a Character**
```javascript
// Creates a new D&D character with full stats
create_character({
  name: "Lyra Swiftarrow",
  class: "Ranger", 
  stats: { strength: 14, dexterity: 18, constitution: 16, intelligence: 12, wisdom: 15, charisma: 10 }
})
```

### **Setup 3D Combat**
```javascript
// Initialize battlefield with terrain
initialize_battlefield({
  width: 15, height: 12,
  terrain: [
    { type: "wall", position: {x: 8, y: 2, z: 0}, dimensions: {width: 1, height: 4, depth: 5} },
    { type: "stairs", position: {x: 5, y: 4, z: 0}, dimensions: {width: 2, height: 2, depth: 5} }
  ]
})

// Place creatures in 3D space
place_creature({
  creature_id: "ranger_lyra", name: "Lyra Swiftarrow",
  x: 6, y: 5, z: 5, size: "medium", speed: 30, reach: 5
})

// Get tactical situation
describe_detailed_tactical_situation({ creature_id: "ranger_lyra" })
```

### **Generate Visual Map**
```javascript
// Creates ASCII battlefield visualization
generate_battlefield_map()
```

### **Advanced Combat Mechanics**
```javascript
// Roll with advantage
roll_dice({ notation: "2d20kh1+5", reason: "Attack with advantage" })

// Check line of sight with cover
check_line_of_sight({ from_creature: "ranger_lyra", to_creature: "goblin_1" })

// Validate movement with opportunity attacks
move_creature({ creature_id: "fighter_kael", target_x: 10, target_y: 8, speed: 25 })
```

## 🔧 **Advanced Features**

### **🎲 Dice System**
- Standard D&D notation: `1d20+5`, `3d6`, `1d8+3`
- Advantage/Disadvantage: `2d20kh1+5`, `2d20kl1+5`
- Critical hits: Automatic damage doubling
- Custom modifiers: Situational bonuses

### **⚔️ Combat Mechanics**
- **Initiative**: Automatic turn order management
- **Action Economy**: Actions, bonus actions, movement, reactions
- **Opportunity Attacks**: Movement validation and triggering
- **Area Effects**: Spell targeting with geometric calculations
- **Cover & Concealment**: Line of sight with partial cover

### **🗺️ Spatial Intelligence**
- **3D Positioning**: Full X, Y, Z coordinate system
- **Terrain Features**: Walls, pillars, stairs, pits, doors
- **Movement Validation**: Pathfinding with obstacle avoidance
- **Tactical Analysis**: Flanking, height advantage, reach calculations

## 🎮 **Integration with AI Dungeon**

Perfect for integration with the [AI Dungeon Experiment](https://github.com/Mnehmos/AI-Dungeon-Experiment):

1. **Create custom Roo Code modes** for Dungeon Master AI
2. **Leverage MCP tools** for consistent mechanics
3. **Maintain persistent state** across gaming sessions  
4. **Generate tactical descriptions** for AI narrative integration

## 🎯 **What Makes This Special**

- ✅ **Visual Combat Maps**: ASCII battlefield with terrain and creatures
- ✅ **True 3D Combat**: Elevation, flying, multilevel encounters  
- ✅ **Human-Readable**: Tactical descriptions perfect for AI integration
- ✅ **Complete D&D 5e**: Full rules implementation with persistent state
- ✅ **AI-Optimized**: Designed specifically for LLM-powered gameplay
- ✅ **Production Ready**: Robust error handling and state management

## 🚀 **Get Started**

Ready to create the ultimate AI-powered D&D experience? Clone this repository and follow the setup instructions above. Within minutes, you'll have a complete RPG system with visual combat maps and advanced tactical intelligence!

---

**🎲 Happy adventuring with AI-powered D&D!** 🐉
