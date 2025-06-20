# 💀 Unified World of Darkness Engine - MCP Servers

**A complete backend server suite for AI-powered World of Darkness chronicles.** Features a unified data model for 6+ game lines, an authentic d10 dice pool engine, and "intelligent" tools designed for robust, interactive storytelling.

## 🚀 **Core Features**

### 🦇 **Unified Engine for 6+ Game Lines**
The system is built on a universal character schema that can handle Vampires, Werewolves, Mages, Changelings, Wraiths, and Mummies in a single, consistent database. Crossover chronicles are not just possible; they are the default.

### 🎲 **Authentic Storyteller System Mechanics**
- **d10 Dice Pool Engine:** A complete replacement of the d20 system. The new engine correctly handles variable difficulties, successes, specialties, and catastrophic botches.
- **WoD Health & Damage:** The HP system has been removed in favor of a proper Health Level tracker that manages Bashing, Lethal, and Aggravated damage.

### 🧠 **Intelligent & Automated Tools**
- **Automated Combat Resolution:** A single `resolve_attack` tool fetches character stats, calculates dice pools, and resolves the entire attack-damage-soak sequence, reducing AI workload and errors.
- **Rules-Aware Character Progression:** A dedicated `spend_experience` tool calculates and enforces the correct XP costs for improving traits, ensuring game balance.
- **Dynamic Data Visualization:** Tools like `display_health` and `generate_character_sheet_html` offload complex formatting from the AI, providing rich, thematic feedback to the player.

## 🏗️ **Project Architecture**

- **`game-state-server/`**: A SQLite-based server for persistent character data. Manages the universal character schema, resources, damage states, and contains the logic for XP costs and data visualization.
- **`combat-engine-server/`**: A mechanics engine that handles all dice rolls and uses the game-state server to resolve complex actions like combat.

## 🛠️ **Prerequisites**

**Roo Code Installation Required:**
- Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=RooVeterinaryInc.roo-cline)
- Configure your AI provider and visit [Roo Code docs](https://docs.roocode.com) for setup details.

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

### 2. **Start Servers**
```bash
# Terminal 1
cd game-state-server && npm start

# Terminal 2  
cd combat-engine-server && npm start
```

### 3. **Configure Roo Code MCP Settings**

Add the following to your `mcp_settings.json` file. Replace `PATH_TO_YOUR_PROJECT` and `PATH_TO_NODE` with your specific local paths.

```json
{
  "mcpServers": {
    "rpg-game-state-wod": {
      "name": "WoD Game State Server",
      "command": "PATH_TO_NODE",
      "args": ["dist/index.js"],
      "cwd": "PATH_TO_YOUR_PROJECT\\rpg-mcp-servers\\game-state-server",
      "enabled": true,
      "alwaysAllow": [
        "create_character", "get_character", "update_character",
        "inflict_damage", "spend_willpower", "spend_resource",
        "display_health", "spend_experience", "generate_character_sheet_html"
      ]
    },
    "rpg-combat-engine-wod": {
      "name": "WoD Combat Engine",
      "command": "PATH_TO_NODE",
      "args": ["dist/index.js"],
      "cwd": "PATH_TO_YOUR_PROJECT\\rpg-mcp-servers\\combat-engine-server",
      "enabled": true,
      "alwaysAllow": [
        "perform_roll", "resolve_attack"
      ]
    }
  }
}
```

## 🎯 **Tool API & Usage Examples**

### **Intelligent Combat Resolution**
```javascript
// A single, simple call from the AI resolves a full combat sequence.
resolve_attack({
  "attacker_id": 1,
  "defender_id": 2,
  "attack_type": "brawl_punch"
})
```

### **Rules-Aware Character Progression**
```javascript
// The AI tells the server what to improve; the server handles the rules and cost.
spend_experience({
  "character_id": 1,
  "trait_to_improve": "attributes.physical.strength"
})
```

### **Data Visualization**
```javascript
// Returns a pre-formatted string for the AI to display.
display_health({ "character_id": 2 })

// Returns a full, styled HTML document.
generate_character_sheet_html({ "character_id": 1 })
```

---

**Welcome to the night.**
