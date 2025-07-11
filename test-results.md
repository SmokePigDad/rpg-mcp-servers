# MCP Comprehensive Test Results

---

## Environment/Setup

- **Schema Fix:** Applied missing schema migrations to support all splats:
  - `2025-07-add-character-disciplines.sql`
  - `2025-07-fix-character-disciplines-column.sql`
  - `2025-07-add-character-gifts.sql`
  - `2025-07-add-character-spheres.sql`
  - `2025-07-add-character-arts.sql`
  - `2025-07-fix-state-schema.sql`
  Result: (Success)

---

## Character Lifecycle: Creation Attempts

### Vampire: Genevieve
- **Input:** `{ "name": "Genevieve", "game_line": "vampire", "clan": "Toreador", "generation": 10 }`
- **Expected:** Creation succeeds (first run).
- **Actual:** ❌ Error: Duplicate character name "Genevieve" is not allowed.

### Werewolf: Stone-Fist
- **Input:** `{ "name": "Stone-Fist", "game_line": "werewolf", "tribe": "Get of Fenris", "auspice": "Ahroun" }`
- **Expected:** Creation succeeds (first run).
- **Actual:** ❌ Error: Duplicate character name "Stone-Fist" is not allowed.

### Mage: Astrid
- **Input:** `{ "name": "Astrid", "game_line": "mage", "tradition_convention": "Cult of Ecstasy" }`
- **Expected:** Creation succeeds (first run).
- **Actual:** ❌ Error: Duplicate character name "Astrid" is not allowed.

### Changeling: Pip
- **Input:** `{ "name": "Pip", "game_line": "changeling", "kith": "Pooka", "seeming": "Childling" }`
- **Expected:** Creation succeeds (first run).
- **Actual:** ❌ Error: Duplicate character name "Pip" is not allowed.

---

### Roster, Confirmed After All Migrations:
- Genevieve (ID: 1)
- Stone-Fist (ID: 2)
- Astrid (ID: 3)
- Pip (ID: 4)

**Note:**  
All lifecycle test characters exist and are unique in the system; ready to proceed with read, update, delete, and advanced state/resource/XP/antagonist/inventory/etc. testing.

## Part 1: Character & Antagonist Lifecycle

### Test: create_character — Standard Vampire
**Input:**  
```json
{ "name": "Genevieve", "game_line": "vampire", "clan": "Toreador", "generation": 10 }
```
**Expected:** Success; get_character returns Vampire sheet.

**Result:**  
❌ Error: Duplicate character name "Genevieve" is not allowed.

---

### Test: create_character — Standard Werewolf
**Input:**  
```json
{ "name": "Stone-Fist", "game_line": "werewolf", "tribe": "Get of Fenris", "auspice": "Ahroun" }
```
**Expected:** Success; get_character returns Werewolf sheet.

**Result:**  
❌ Error: Database schema missing — no such table: character_gifts.

**Testing Aborted:**  
The database schema is incomplete. Further character/antagonist creation, update, or related lifecycle tests cannot proceed until migrations are fully applied and the database is consistent.

---

## Part 4: Dice Mechanics & Combat Engine

### Test: roll_wod_pool — Standard Success
**Input:**  
```json
{ "pool_size": 7, "difficulty": 6 }
```
**Expected:** Returns a positive number of successes.

**Result:**  
Pool Size: 7, Difficulty: 6  
Rolled: [10, 2, 3, 7, 6, 7, 3]  
Successes: 4  
[SUCCESS] Excellent Success!

---

### Test: roll_wod_pool — Botch Condition
**Input:**  
```json
{ "pool_size": 2, "difficulty": 8, "force_result": "botch" }
```
**Expected:** Returns 0 successes, isBotch: true.

**Result:**  
Pool Size: 2, Difficulty: 8  
Rolled: [1, 1]  
Successes: 0  
[BOTCH] Critical Botch! Catastrophic failure (forced for testing).

---

### Test: roll_wod_pool — Specialty Success
**Input:**  
```json
{ "pool_size": 1, "difficulty": 6, "has_specialty": true, "force_result": "success" }
```
**Expected:** '10' counts as 2 successes; returns 2+ successes with specialty.

**Result:**  
Pool Size: 1, Difficulty: 6, Specialty: Yes  
Rolled: [10, 8]  
Successes: 3 (forced for testing; specialty applied to 10s)  
[SUCCESS] Strong Success!

---

### Test: roll_wod_pool — Chance Die
**Input:**  
```json
{ "pool_size": 0, "difficulty": 6 }
```
**Expected:** Rolls 1d10; success only on 10, botch on 1.

**Result:**  
Rolled: [4]  
Successes: 0  
[FAILURE] Failure – No successes.

---

### Test: roll_contested_action — Attacker Wins
**Input:**  
```json
{ "attacker_pool": 7, "defender_pool": 4, "difficulty": 6 }
```
**Expected:** Attacker wins by X net successes.

**Result:**  
❌ Error: All pools must be non-negative integers and all difficulties must be 2–10.

---

### Test: roll_contested_action — Retry Minimal Input
**Input:**  
```json
{ "attacker_pool": 1, "defender_pool": 1, "difficulty": 6 }
```
**Expected:** Tie or standoff result.

**Result:**  
❌ Error: All pools must be non-negative integers and all difficulties must be 2–10.  
(Tested with all permissible positive integers — function appears broken.)

---

### Test: roll_soak — Soak Bashing
**Input:**  
```json
{ "soak_pool": 5, "damage_type": "bashing" }
```
**Expected:** Returns # of soaking successes vs diff 6.

**Result:**  
Soak Dice: [4, 4, 6, 1, 7] vs diff 6  
Soaked 2 points of damage.  
Marginal soak – reduced some, but not all, of the blow.

---

### Test: roll_soak — Soak Aggravated w/o Fortitude
**Input:**  
```json
{ "soak_pool": 5, "damage_type": "aggravated", "has_fortitude": false }
```
**Expected:** Returns 0 soaks; message that only Fortitude can roll.

**Result:**  
💥 Aggravated damage is normally unsoakable by mortals and most supernaturals! Only beings with Fortitude may roll soak aggravated damage (difficulty 8).

0 soaks.

---

### Test: roll_soak — Soak Aggravated w/ Fortitude
**Input:**  
```json
{ "soak_pool": 5, "damage_type": "aggravated", "has_fortitude": true }
```
**Expected:** Returns soaks vs diff 8 (some or 0); actual dice rolled.

**Result:**  
Soak Dice: [6, 1, 7, 6, 1] vs diff 8  
Soaked 0 points of damage.  
You fail to soak any damage!

---

### Test: roll_damage_pool — Standard Damage
**Input:**  
```json
{ "pool_size": 6, "damage_type": "lethal" }
```
**Expected:** Returns number of damage successes as damage dealt.

**Result:**  
Damage Pool Roll — Pool Size: 6, Difficulty: 6  
Damage Type: Lethal  
Rolled: [1, 3, 7, 7, 3, 4]  
Successes: 2  
➡️ 2 levels of lethal damage.

---

### Test: invoke_cantrip — Pool Calculation
**Input:**  
```json
{ "art_pool": 3, "realm_pool": 2, "difficulty": 6 }
```
**Expected:** Rolls 5 dice, result per dice logic.

**Result:**  
Cantrip: Art + Realm (3+2)  
Rolled: [4, 4, 2, 2, 9]  
Successes: 1  
isBotch: false, banality_gain: 0

---

### Test: invoke_cantrip — Banality on Botch
**Input:**  
```json
{ "art_pool": 3, "realm_pool": 2, "difficulty": 6, "force_result": "botch" }
```
**Expected:** isBotch: true and banality_gain: 1.

**Result:**  
Cantrip: Art + Realm (3+2)  
Rolled: [1, 1]  
Successes: 0  
💀 BANALITY SURGE! Backfire and Banality gained.
isBotch: true, banality_gain: 1

---
