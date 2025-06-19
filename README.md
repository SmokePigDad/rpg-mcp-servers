# 💀 Unified World of Darkness Engine - MCP Servers

> **_Updated for the new World of Darkness project overhaul (June 2025)._**
**A complete backend server suite for AI-powered World of Darkness chronicles.** Features a unified data model for 6+ game lines, an authentic d10 dice pool engine, and tools designed for interactive, choice-based storytelling.

## 🚀 **Core Features**

### 🦇 **Unified Engine for 6+ Game Lines**
The system is built on a universal character schema that can handle Vampires, Werewolves, Mages, Changelings, Wraiths, and Mummies in a single, consistent database. Crossover chronicles are not just possible; they are the default.

### 🎲 **Authentic Storyteller System Mechanics**
- **d10 Dice Pool Engine:** A complete replacement of the d20 system. The new engine correctly handles variable difficulties, successes, specialties, and catastrophic botches.
- **WoD Health & Damage:** The HP system has been removed in favor of a proper Health Level tracker that manages Bashing, Lethal, and Aggravated damage.

### 💬 **Designed for Interactive Storytelling**
The toolset has been streamlined to support a "Describe -> Ask -> Resolve" gameplay loop. The AI uses generic, powerful tools to resolve player choices, making for a more dynamic and collaborative narrative experience.

## 🏗️ **Project Architecture**

- **`game-state-server/`**: A SQLite-based server for persistent character data. Manages the universal character schema, resources (Blood, Gnosis, Rage, etc.), and damage states.
- **`combat-engine-server/`**: A stateless mechanics engine that handles all dice rolls for the Storyteller System, including a streamlined combat resolver.

## 🛠️ **Prerequisites**

**Roo Code Installation Required:**
- Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=RooVeterinaryInc.roo-cline)
- Or via CLI: `code --install-extension RooVeterinaryInc.roo-cline`
- Configure your AI provider (OpenAI, Anthropic, etc.).
- Visit [Roo Code docs](https://docs.roocode.com) for setup details.

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

Add the following to your `mcp_settings.json` file. Replace `PATH_TO_YOUR_PROJECT` with the full, absolute path to your `oWoD-Game-Experiment` folder (e.g., `E:\\Tinker\\oWoD-Game-Experiment`) and `PATH_TO_NODE` with the path to your `node.exe` (e.g., `D:\\Program Files\\nodejs\\node.exe`).

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
        "inflict_damage", "spend_willpower", "spend_resource"
      ]
    },
    "rpg-combat-engine-wod": {
      "name": "WoD Combat Engine",
      "command": "PATH_TO_NODE",
      "args": ["dist/index.js"],
      "cwd": "PATH_TO_YOUR_PROJECT\\rpg-mcp-servers\\combat-engine-server",
      "enabled": true,
      "alwaysAllow": [
        "perform_roll", "perform_combat_roll"
      ]
    }
  }
}
```

## 🎯 **Usage Examples**

### **Create a Character**
```javascript
// Creates a new Vampire character with a full WoD stat block
create_character({
  "name": "Victor",
  "character_type": "Vampire",
  "splat1": "Ventrue",
  "attributes": { "physical": {"strength": 2}, "social": {"charisma": 4}, "mental": {"wits": 3} },
  "abilities": { "talents": {"subterfuge": 3}, "skills": {"etiquette": 2}, "knowledges": {"politics": 2} },
  "willpower_permanent": 5,
  "powers": { "disciplines": { "Dominate": 2, "Presence": 1 } },
  "resources": { "blood_pool": 10 }
})
```

### **Perform a Skill Check**
```javascript
// The AI constructs this call after the player decides to sneak
perform_roll({
  "pool_size": 6, // Dexterity 3 + Stealth 3
  "difficulty": 7,
  "reason": "Dexterity + Stealth to slip past the security camera"
})
```

### **Resolve a Combat Action**
```javascript
// A single call to handle an entire attack sequence
perform_combat_roll({
  "attacker_name": "Brujah Thug",
  "defender_name": "Security Guard",
  "attack_pool": 6, // Dex 3 + Brawl 3
  "attack_difficulty": 6,
  "damage_pool": 4, // Strength 4 + 0 for punch
  "soak_pool": 3, // Stamina 3
  "damage_type": "bashing"
})
```

---
**Welcome to the night.**
```
