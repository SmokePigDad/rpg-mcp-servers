# SYSTEM ARCHITECTURE

## Overview

This project implements an extensible, modular World of Darkness Model Context Protocol (MCP) engine using a **two-server model**:

- **game-state-server**: Handles persistent data, database operations, character/NPC state management, antagonist creation, resource tracking, and more.
- **combat-engine-server**: Implements game mechanic and combat tools, dice pool rolling, contest adjudication, and splat-specific special mechanics (e.g., Vampire Frenzy, Mage magick).

The servers coordinate via API tool calls and protocol messages, enabling robust multi-splat support and future extensibility.

---

## Database Schema

### Core Player Character Table
- `characters`: ID, name, concept, game_line, **attributes** (strength, dex, etc.), health, willpower, experience, etc.

### Modular Trait Tables (per splat)
- `character_vampire_traits`: clan, generation, blood_pool, humanity, etc.
- `character_werewolf_traits`: breed, auspice, tribe, gnosis, rage, renown, etc.
- `character_mage_traits`: tradition_convention, arete, quintessence, paradox
- `character_changeling_traits`: kith, seeming, glamour, banality

### Antagonists/NPCs
- `npcs`: matches core schema of `characters` (game_line, traits, stats).
- Modular splat tables mirror the ones above for NPCs: e.g., `npc_vampire_traits`, etc.

### Relational / Supporting Tables
- `character_abilities`, `character_disciplines`, `character_arts`, `character_realms`, `character_gifts`, `character_spheres`, `xp_ledger`, `derangements`, `inventory`, etc.

---

## MCP Tools

### Shared (All Game Lines)
- `create_character`
- `get_character`
- `update_character`
- `apply_damage`
- `spend_resource`
- `gain_resource`
- `restore_resource`
- `create_antagonist`
- `get_antagonist`
- ... and more

### Vampire (VTM)
- `roll_virtue_check` (virtue checks, Humanity, Frenzy, Rötschreck)
- Resources: `blood`, `willpower`, `humanity`

### Werewolf (WtA)
- `change_form`
- `spend_rage_for_extra_actions`
- Resources: `rage`, `gnosis`, `willpower`

### Mage (MtA)
- `roll_magick_effect`
- Resources: `quintessence`, `paradox`, `willpower`
- `spheres`, `arete`

### Changeling (CtD)
- `invoke_cantrip`
- Resources: `glamour`, `banality`, `willpower`
- `arts`, `realms`

### Initiative Management
- `roll_initiative_for_scene`
- `set_initiative`
- `get_initiative_order`
- `advance_turn`
- `get_current_turn`

### Social Combat
- `roll_social_combat`

### Damage
- `roll_damage_pool`
- `apply_damage`
- `roll_soak`

---

## Example Combat Turn Sequence

1. **Storyteller** calls `get_current_turn` (to see whose turn it is)
2. **AI/NPC/Player** acts; action is narrated
3. **AI** calls `roll_wod_pool` for action (attack, power, etc.)
4. **AI** calls `roll_damage_pool` if attack is successful
5. **AI** calls `apply_damage` with damage results
6. **AI** calls `advance_turn` to move to next participant

At each step, MCP tools ensure the correct rules, initiative order, and health tracking are applied, automatically adapting to the current splat and game context.

---

## Expansion

The MCP system is designed for future extensibility: add new splats, modular trait tables, antagonist templates, and tools as desired.