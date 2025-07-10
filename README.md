# 🦇 MCP Servers – Old World of Darkness (Storyteller System) Automation Suite

**Advanced Model Context Protocol (MCP) servers for AI-powered Storyteller System play.** Automate, adjudicate, and manage classic ("oWoD") World of Darkness games: Vampire: the Masquerade, Werewolf: the Apocalypse, Mage: the Ascension, Changeling: the Dreaming, and more.

---

## 🎲 What is This?

This suite empowers digital play, AI storytelling, and character management for classic World of Darkness settings—integrating rules knowledge, dice pools, resource tracking, combat, and persistent world state. Features include:

- Automated character (PC/NPC) creation and full stat management
- Persistent chronicles: health, willpower, Virtues, supernatural traits
- Status effect and antagonist management
- Extended support for all major oWoD "splats" (Vampire, Werewolf, Mage, Changeling)
- Tactical features: initiative, status effects, and narrative-driven scene tools
- API exposes tools as callable endpoints for AI DM/storyteller, custom UIs, or game integration

---

## 🔥 Latest Major Updates

- **ASCII Battlefield Visualization**: Render spatial combat/narrative scenes using gridded ASCII maps for any Storyteller line.
- **Shared 3rd Edition Dice Pool System**: Handles dice pool rolls, Virtue checks, contested actions, soak, and resource spends.
- **Full health/resource engine**: Supports Bruised–Mauled track, willpower, blood/Gnosis/Glamour/Quintessence.
- **Modular Splat Features**: Each game line exposes traits, resources, and mechanics (Frenzy, Magick, Rage, etc.).

---

## 🗂️ Project Architecture

- **game-state-server/**: Handles persistent character sheets, inventory, antagonists, world states, status effects.
- **combat-engine-server/**: All dice pool and contest mechanics: Virtue checks, magick, cantrips, initiative, social/physical/combat actions.

Servers communicate via protocol/API; see [`SYSTEM_ARCHITECTURE.md`](SYSTEM_ARCHITECTURE.md) for full model.

---

## 📚 Developer Documentation

- [TOOLS.md](./TOOLS.md): **Schemas and input/output formats** for all tools and endpoints—crucial for scripting, automation, or integration.
- [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md): Design and schema docs.
- [quick-start-guide.md](./quick-start-guide.md): End-user and Storyteller-facing usage reference.

---

## ⚙️ Key Features

### 🧛 Complete Character & Chronicle Management
- Supports all oWoD traits: Attributes, Abilities, Virtues, Backgrounds
- Automated creation of Vampire, Werewolf, Mage, Changeling, and generic mortals
- Full inventory, XP, story/quest persistence, and antagonist tools

### 🗡️ Advanced Storyteller System Dice Engine
- Dice pool rolling (d10), specialties, and botch/success automation
- Virtue checks, Frenzy, Rötschreck, Rage, Magick, Cantrips
- Initiative, social, physical, mental, and supernatural contests
- Health track and status effect management

### 🗺️ Narrative & Scene Control
- ASCII battle/narrative maps for grid-based or positional play
- Story progress tracking by chapter and scene
- Resource expenditure, recovery, and event logging

---

## 🛠️ Prerequisites

**Roo Code Installation Required:**
- Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=RooVeterinaryInc.roo-cline)
- Or via CLI: `code --install-extension RooVeterinaryInc.roo-cline`
- Configure AI provider (OpenAI, Anthropic, etc.)
- Visit [Roo Code docs](https://docs.roocode.com) for setup details

---

## 🚀 Quick Setup

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
Create `.env` files in each server directory as needed for DB or integration customization.

---

## 🧩 See Also

- [`TOOLS.md`](TOOLS.md): Tool and API reference for all MCP endpoints (parameter details and schema samples)
- [`SYSTEM_ARCHITECTURE.md`](SYSTEM_ARCHITECTURE.md): Technical architecture/design and database documentation
- [`quick-start-guide.md`](quick-start-guide.md): Practical usage and actual gameplay flow

---

_This project is unaffiliated with White Wolf/Paradox Interactive. For use with the original World of Darkness (Storyteller System) games only._
