# Test Block 2: Resources, Health & Progression

## Overview
This test block covers resource management (willpower, blood, etc.), health/damage systems, and character progression through experience points. These systems manage the dynamic aspects of character state.

## Tools Covered
- `spend_resource`
- `restore_resource` 
- `gain_resource`
- `apply_damage`
- `award_xp`
- `spend_xp`
- `improve_trait`
- `get_trait_improvement_cost`

---

## Test Cases

### Resource Management

#### `spend_resource`
**Test 2.1: Spend Willpower**
- **Goal**: Spend willpower for automatic success
- **Input**: `{ "character_id": <vampire_ID>, "resource_name": "willpower", "amount": 1 }`
- **Expected**: Willpower reduced by 1, success message with current/max values

**Test 2.2: Spend Blood (Vampire)**
- **Goal**: Vampire spends blood for healing
- **Input**: `{ "character_id": <vampire_ID>, "resource_name": "blood", "amount": 2 }`
- **Expected**: Blood pool reduced by 2

**Test 2.3: Spend Rage (Werewolf)**
- **Goal**: Werewolf spends rage for extra actions
- **Input**: `{ "character_id": <werewolf_ID>, "resource_name": "rage", "amount": 1 }`
- **Expected**: Rage reduced by 1

**Test 2.4: Validation - Insufficient Resource**
- **Goal**: Prevent overspending resources
- **Input**: `{ "character_id": <ID>, "resource_name": "willpower", "amount": 10 }`
- **Expected**: Error: "Not enough willpower. Has X, needs 10."

**Test 2.5: Validation - Invalid Resource**
- **Goal**: Reject spending unavailable resource
- **Input**: `{ "character_id": <mage_ID>, "resource_name": "blood", "amount": 1 }`
- **Expected**: Error: "Invalid resource 'blood' for game_line 'mage'"

#### `restore_resource`
**Test 2.6: Restore Willpower**
- **Goal**: Restore willpower after rest
- **Input**: `{ "character_id": <ID>, "resource_name": "willpower", "amount": 2 }`
- **Expected**: Willpower increased, capped at permanent maximum

**Test 2.7: Restore Blood Pool**
- **Goal**: Vampire feeds to restore blood
- **Input**: `{ "character_id": <vampire_ID>, "resource_name": "blood", "amount": 3 }`
- **Expected**: Blood pool increased up to generation maximum

**Test 2.8: Over-Restoration Capping**
- **Goal**: Prevent restoring beyond maximum
- **Input**: Restore more than permanent maximum allows
- **Expected**: Resource capped at permanent maximum value

#### `gain_resource`
**Test 2.9: Gain Blood from Feeding**
- **Goal**: Vampire gains blood from successful feeding
- **Input**: `{ "character_id": <vampire_ID>, "resource_name": "blood", "roll_successes": 3 }`
- **Expected**: Blood pool increases by 3 (up to max)

**Test 2.10: Gain Quintessence (Mage)**
- **Goal**: Mage gains quintessence from node
- **Input**: `{ "character_id": <mage_ID>, "resource_name": "quintessence", "roll_successes": 2 }`
- **Expected**: Quintessence increased by 2

**Test 2.11: Validation - Zero Successes**
- **Goal**: Reject zero or negative successes
- **Input**: `{ "character_id": <ID>, "resource_name": "blood", "roll_successes": 0 }`
- **Expected**: Error: "roll_successes must be a positive number."

---

### Health & Damage

#### `apply_damage`
**Test 2.12: Apply Bashing Damage**
- **Goal**: Apply non-lethal damage
- **Input**: `{ "character_id": <ID>, "damage_type": "bashing", "amount": 2 }`
- **Expected**: Health track shows 2 bashing damage levels

**Test 2.13: Apply Lethal Damage**
- **Goal**: Apply lethal damage
- **Input**: `{ "character_id": <ID>, "damage_type": "lethal", "amount": 1 }`
- **Expected**: Health track shows lethal damage, bashing upgrades

**Test 2.14: Apply Aggravated Damage**
- **Goal**: Apply aggravated damage
- **Input**: `{ "character_id": <ID>, "damage_type": "aggravated", "amount": 1 }`
- **Expected**: Health track shows aggravated damage, other damage upgrades

**Test 2.15: Damage Overflow**
- **Goal**: Test damage exceeding health track
- **Input**: Apply 8 lethal damage to character
- **Expected**: Character incapacitated, health track full

**Test 2.16: Wound Penalties**
- **Goal**: Verify wound penalties are calculated
- **Input**: Apply 3 lethal damage, then check character sheet
- **Expected**: Character shows appropriate wound penalty (-1 or -2)

---

### Experience & Progression

#### `award_xp`
**Test 2.17: Award Experience Points**
- **Goal**: Give XP for story completion
- **Input**: `{ "character_id": <ID>, "amount": 5, "reason": "Completed investigation" }`
- **Expected**: Character XP increased by 5, reason logged

**Test 2.18: Multiple XP Awards**
- **Goal**: Accumulate XP from multiple sources
- **Input**: Award XP multiple times to same character
- **Expected**: XP totals accumulate correctly

#### `get_trait_improvement_cost`
**Test 2.19: Attribute Cost Calculation**
- **Goal**: Calculate cost to improve attribute
- **Input**: `{ "character_id": <ID>, "trait_type": "attribute", "trait_name": "strength" }`
- **Expected**: Correct cost formula (new rating × 4)

**Test 2.20: Ability Cost Calculation**
- **Goal**: Calculate cost to improve ability
- **Input**: `{ "character_id": <ID>, "trait_type": "ability", "trait_name": "brawl" }`
- **Expected**: Correct cost formula (new rating × 2)

**Test 2.21: Discipline Cost Calculation**
- **Goal**: Calculate cost to improve discipline
- **Input**: `{ "character_id": <vampire_ID>, "trait_type": "discipline", "trait_name": "celerity" }`
- **Expected**: Correct cost formula (new rating × 7)

#### `improve_trait`
**Test 2.22: Improve Attribute with XP**
- **Goal**: Spend XP to increase attribute
- **Input**: `{ "character_id": <ID>, "trait_type": "attribute", "trait_name": "strength" }`
- **Expected**: Strength increased by 1, XP reduced by cost

**Test 2.23: Improve Discipline**
- **Goal**: Spend XP to increase discipline
- **Input**: `{ "character_id": <vampire_ID>, "trait_type": "discipline", "trait_name": "celerity" }`
- **Expected**: Celerity increased, XP reduced appropriately

**Test 2.24: Validation - Insufficient XP**
- **Goal**: Prevent improvement without enough XP
- **Input**: Try to improve expensive trait without enough XP
- **Expected**: Error: "Not enough XP. Has X, needs Y."

**Test 2.25: Validation - Invalid Trait**
- **Goal**: Reject improvement of nonexistent trait
- **Input**: `{ "character_id": <ID>, "trait_type": "attribute", "trait_name": "cooking" }`
- **Expected**: Error: "Trait 'cooking' not found."

#### `spend_xp`
**Test 2.26: Direct XP Spending**
- **Goal**: Spend XP for custom purposes
- **Input**: `{ "character_id": <ID>, "amount": 3, "reason": "Custom equipment" }`
- **Expected**: XP reduced by 3, spending logged

---

## Success Criteria
- All resource operations work correctly for each game line
- Resource validation prevents invalid operations
- Damage system properly tracks and upgrades damage types
- XP cost calculations use correct formulas
- Trait improvements work and consume correct XP
- All validation prevents invalid operations

## Dependencies
- Requires characters created in Test Block 1
- Characters should have various game lines for resource testing
