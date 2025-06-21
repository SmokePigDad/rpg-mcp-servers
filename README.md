# 💀 Unified World of Darkness Engine - MCP Servers

**A backend server suite for AI-powered World of Darkness chronicles.** Play classic Vampire, Werewolf, Mage, Changeling, Wraith, or Mummy games with automated Storyteller System mechanics. This project powers fully interactive, choice-driven WoD games with authentic server-side rules enforcement for all sheet, dice, combat, resource, and XP systems.

---

## 🚀 What's New?

### 🦇 Universal World of Darkness Engine
- **Supports 6+ Game Lines:** Vampire, Werewolf, Mage, Changeling, Wraith, and Mummy all run in a single, unified database and action engine. Full crossover support—no hacks required.

### 🔄 Choice-Based Progression Workflow
- Built for "Describe → Ask → Resolve" scenes—every action is resolved by player choice and server-validated mechanics.
- Robust API for AI/interactive clients; not just dice calculators.

### 🎲 Authentic Storyteller System Mechanics
- **d10 Dice Pool Engine:** Accurate variable-difficulty rolls, specialties, botch detection.
- **Health System:** Tracks bashing, lethal, aggravated—no HP fudge.
- **Dot-Notation Stats:** Native for Attributes, Abilities, Disciplines, Resources, etc.
- **Supernatural/Resource Points:** Automated pools for blood, rage, quintessence, and others.

### ⚡️ Automated Play Tools
- **Automated Combat (`resolve_attack`):** Server validates all pools; no player-side math.
- **XP/Leveling:** XP spend menus use server logic, following WoD costs for all traits.
- **Live Status Output:** `display_health` and `generate_character_sheet_html` provide auto-updating health/status and graphical full sheets.
- **Resource Mgmt:** Blood, rage, glamour, etc., tracked/expended by server (always accurate).

### 🛠️ Project Architecture

- **`game-state-server/`:** Persistent sheet/world data (universal WoD schema, xp, wounds, resources, powers).
- **`combat-engine-server/`:** d10 mechanics, action resolution, and combat.
- **Cross-service API:** Accepts tool calls from AI/clients; direct scripting also possible.

---

## 🛠️ MCP API - Core Tools

- **create_character**: Create PC/NPC for any WoD type. Enforced point-buy/step methods.
- **get_character / update_character**: Retrieve or update any sheet field via dot notation.
- **inflict_damage**: Direct damage application (bashing, lethal, agg), with auto-soak and health logic.
- **display_health / generate_character_sheet_html**: Output health/status and graphic HTML sheets.
- **perform_roll**: d10 pool action for all non-combat checks (skill/power/attribute).
- **resolve_attack**: Complete combat actions, using all stats server-side.
- **spend_resource / spend_willpower**: Resource and temp willpower trackers.

See the `COMMIT_MSG.txt` and inline comments for expanded tool info and updates.

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

- Configure `mcp_settings.json` in your client project.
- Both servers should be active for full feature support.

### 4. AI-Driven Play Integration

- This engine suite is built to be used directly (CLI/scripts), but is designed for AI-powered frontends like [oWoD-Game-Experiment](https://github.com/SmokePigDad/oWoD-Game-Experiment).
- The client provides the Storyteller experience, guiding the player through truly choice-driven, server-enforced games without fudge or rule-breaking.

---

## 💡 Feature Highlights

- **Server-Side Sheet Enforcement:** All stats, modifications, and costs follow published WoD rules (Pre-Time of Judgment era).
- **No Client-Side Cheats:** XP, health, damage, powers—always validated server-side, never fudged in UI.
- **Choice-Based Narrative:** Every decision point is an explicit player choice, resolved by the API and described by the client AI.
- **Full Crossover:** All splats (kindred, garou, mages, etc.) in a unified system.
- **Visual Character Sheets:** Instant HTML output for in-game display, digital or printed.
- **No Homebrew Required:** Rules-as-Written for all games and powers.

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

// Resolve a complete attack (see docs for pre-calculated pools)
resolve_attack({
  "attacker_name": "Victor",
  "defender_name": "Marcus",
  "attack_pool": 8,
  "damage_pool": 2,
  "soak_pool": 4,
  "attack_difficulty": 6,
  "damage_type": "bashing"
})

// Spend XP
spend_experience({
  "character_id": 1,
  "trait_to_improve": "powers.disciplines.Fortitude"
})
```

---

## 🦇 Recent Changes

- D&D code and templates fully purged.
- Cross-splat/crossover handling is rules-native.
- Tools and engine logic are fully synchronized with AI-powered client workflows.
- Documentation clarified for unified, choice-based, Pre-ToJ (classic) WoD play only.

---

**Welcome to the World of Darkness—every choice resolved by Storyteller rules, never railroaded, never cheated.**
