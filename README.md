# 💀 Unified World of Darkness Engine - MCP Servers

**A complete backend server suite for AI-powered World of Darkness chronicles.** Run classic Vampire, Werewolf, Mage, Changeling, Wraith, or Mummy games with authentic rules logic and fully automated mechanics for the "Storyteller System." Features a unified data model, a d10 dice pool engine, world-class damage/health tracking, and automation for XP, powers, and character sheets. Now designed for seamless choice-based interactive play, not just dice calculations.

---

## 🚀 What's New!

### 🦇 Universal World of Darkness Engine
- **Supports 6+ Game Lines**: Play as Vampire, Werewolf, Mage, Changeling, Wraith, or Mummy in a single, unified database and combat logic system. Crossover is natively supported—no homebrew required!

### 🔄 Choice-Based Progression Workflow
- Engineered for "Describe → Ask → Resolve" interactivity with intelligent branching logic and server-side integrity enforcement.
- API designed for interactive, player-choice-driven narrative flow, not just mechanical actions.

### 🎲 Authentic Storyteller System Mechanics
- **d10 Dice Pool Engine**: Accurate die pool math, variable difficulty, specialties, botch support.
- **True WoD Health System**: Bashing, Lethal, and Aggravated health tracked by server logic (no HP fudge).
- **Dot-Notation Stats**: Attributes, Abilities, Disciplines, Paths, Resources, etc. are all flexible, structured JSON.
- **Supernatural Points**: Manages blood, rage, quintessence, etc. for all splats.

### ⚡️ Automated Play Tools
- **Automated Combat (`resolve_attack`)**: Fully automates attack/damage/soak, using server stats for both attacker and defender—no manual calculation needed.
- **Rules-Enforced XP (`spend_experience`)**: Calculates and enforces proper WoD XP costs for attributes, abilities, disciplines, virtues, willpower, humanity and more.
- **Live Health & Status Output**: Engine generates player-friendly health/status strings and graphical HTML sheets (`display_health`, `generate_character_sheet_html`).
- **Resource Management**: Automated tracking and expenditure/refresh for blood pool, rage, glamour, pathos, sekhem, etc.

### 🛠️ Project Architecture

- **`game-state-server/`**: SQLite-based server for persistent character and world data. Hosts the universal WoD schema, resource pools, wounds, powers, and XP logic.
- **`combat-engine-server/`**: The d10 mechanic and combat action engine. Handles all dice, difficulties, botches, and resolves actions using data from game-state.
- **Cross-service API**: Designed to accept tool calls from interactive UI/AI clients or direct scripting.

---

## 🛠️ MCP API - Core Tools

- **create_character**: Build a new PC/NPC of any WoD type, using the universal point-buy or step-based method.
- **get_character / update_character**: Full support for dot notation updates and fast stat retrieval.
- **inflict_damage**: Server-authentic health level damage and tracking (bashing/lethal/aggravated).
- **display_health / generate_character_sheet_html**: Instant health/status string and graphical HTML sheet rendering (plug-and-play for clients).
- **perform_roll**: Unified d10 pool action handling all non-combat skill/power/attribute checks.
- **resolve_attack**: Server-resolved combat; provides attack, damage, and soak using stats for both sides.
- **spend_resource / spend_willpower**: Handles all temp/supernatural point draining/tracking.

And more—examine the `COMMIT_MSG.txt` and comments for tool expansion details.

---

## 🏗️ Quick Start

### 1. Install & Build

```bash
# Game State Server
cd game-state-server
npm install && npm run build

# Combat Engine Server  
cd ../combat-engine-server
npm install && npm run build
```

### 2. Start Servers

```bash
# Terminal 1
cd game-state-server && npm start

# Terminal 2  
cd combat-engine-server && npm start
```

### 3. Connect With Roo Code

- Add both servers to your `mcp_settings.json`
- Paste paths for node and each server's directory as needed.
- Enable both for the best interactive AI experience.

### 4. How It Fits

You can use this engine suite directly (CLI or scripting), but it's designed to work best with AI-powered clients like [oWoD-Game-Experiment](https://github.com/SmokePigDad/oWoD-Game-Experiment), which acts as Storyteller and guides the player through the game with full server-side rules and narrative logic. All gameplay becomes choice-driven, with NO need for client-side fudge or broken rules.

---

## 💡 Feature Highlights (2025 Edition)

- Full **Point-Buy Character Creation**, enforced by server-side logic.
- **XP Spend Menu** with proper cost rules for all traits.
- **Visual Character Sheets**: Generate rich HTML sheets for players and NPCs at any time.
- **Self-Consistency**: All modifications, wounds, XP spends, and power uses validated by server logic.
- **Crossover-Ready**: Run games with vampire, werewolf, mage, and more—no tweaks required.
- **Default is Rules-as-Written** for pre-Time of Judgment play.

---

## 🎯 Example Tool Calls

```javascript
// Create a new Ventrue Vampire
create_character({
  "name": "Victor",
  "character_type": "Vampire",
  "splat1": "Ventrue",
  "attributes": { ... },
  "abilities": { ... },
  "willpower_permanent": 5
})

// Resolve a full punch attack
resolve_attack({
  "attacker_id": 1,
  "defender_id": 2,
  "attack_type": "brawl_punch"
})

// Automate XP spend
spend_experience({
  "character_id": 1,
  "trait_to_improve": "powers.disciplines.Fortitude"
})
```

---

## 🦇 Upgrade Notes

- All D&D code/templates purged.
- Engine is now WoD/Storyteller-native at every layer.
- New instructions, templates, and client support the narrative, interactive, and graphical features classic WoD deserves.

---

**Welcome to the World of Darkness—where every choice is resolved with authentic Storyteller rules and your game is never railroaded.**
