# Test Block 4: Dice Mechanics & Combat Engine

## Overview
This test block covers all dice rolling mechanics, combat resolution, and game-line specific rules handled by the combat-engine-server. These are the core mechanical systems that adjudicate actions and conflicts.

## Tools Covered
- `roll_wod_pool`
- `roll_contested_action`
- `roll_soak`
- `roll_damage_pool`
- `roll_virtue_check`
- `change_form`
- `spend_rage_for_extra_actions`
- `roll_magick_effect`
- `invoke_cantrip`
- `roll_social_combat`

---

## Test Cases

### Core Dice Mechanics

#### `roll_wod_pool`
**Test 4.1: Basic Success Roll**
- **Goal**: Test standard dice pool mechanics
- **Input**: `{ "pool_size": 5, "difficulty": 6, "has_specialty": false }`
- **Expected**: Correct success count, clear result description

**Test 4.2: Specialty Roll**
- **Goal**: Verify specialty rule (10s count as 2 successes)
- **Input**: `{ "pool_size": 3, "difficulty": 6, "has_specialty": true }`
- **Expected**: Rolls of 10 add 2 successes instead of 1

**Test 4.3: High Difficulty Roll**
- **Goal**: Test difficult actions
- **Input**: `{ "pool_size": 4, "difficulty": 9, "has_specialty": false }`
- **Expected**: Only 9s and 10s count as successes

**Test 4.4: Zero Dice Pool**
- **Goal**: Handle zero dice (chance die)
- **Input**: `{ "pool_size": 0, "difficulty": 6 }`
- **Expected**: Rolls 1 chance die (10=success, 1=botch)

**Test 4.5: Negative Dice Pool**
- **Goal**: Reject invalid negative pools
- **Input**: `{ "pool_size": -1, "difficulty": 6 }`
- **Expected**: Error about invalid pool size

**Test 4.6: Botch Detection**
- **Goal**: Verify botch mechanics (no successes + 1s)
- **Input**: Roll until botch occurs or simulate
- **Expected**: Botch properly identified and described

#### `roll_contested_action`
**Test 4.7: Standard Contested Roll**
- **Goal**: Test opposed action resolution
- **Input**: `{ "attacker_pool": 6, "attacker_difficulty": 6, "attacker_specialty": false, "defender_pool": 4, "defender_difficulty": 7, "defender_specialty": false }`
- **Expected**: Net successes calculated, winner determined

**Test 4.8: Tied Contested Roll**
- **Goal**: Handle equal successes
- **Input**: Arrange for equal success counts
- **Expected**: Tie properly identified and handled

**Test 4.9: Double Botch**
- **Goal**: Handle both sides botching
- **Input**: Simulate both attacker and defender botching
- **Expected**: Double botch identified with appropriate consequences

**Test 4.10: Contested with Specialties**
- **Goal**: Test contested roll with specialties
- **Input**: `{ "attacker_pool": 4, "attacker_specialty": true, "defender_pool": 3, "defender_specialty": true, ... }`
- **Expected**: Specialties applied correctly to both sides

#### `roll_soak` & `roll_damage_pool`
**Test 4.11: Soak Bashing Damage**
- **Goal**: Roll to reduce bashing damage
- **Input**: `{ "soak_pool": 3, "damage_type": "bashing", "has_fortitude": false }`
- **Expected**: Soak successes reduce incoming damage

**Test 4.12: Soak Lethal Damage**
- **Goal**: Roll to reduce lethal damage
- **Input**: `{ "soak_pool": 3, "damage_type": "lethal", "has_fortitude": false }`
- **Expected**: Only Stamina dice count (no armor vs lethal)

**Test 4.13: Soak with Fortitude**
- **Goal**: Vampire soaks lethal with Fortitude
- **Input**: `{ "soak_pool": 5, "damage_type": "lethal", "has_fortitude": true }`
- **Expected**: All dice count for lethal soak

**Test 4.14: Soak Aggravated Damage**
- **Goal**: Attempt to soak aggravated damage
- **Input**: `{ "soak_pool": 4, "damage_type": "aggravated", "has_fortitude": true }`
- **Expected**: Only Fortitude dice count, very limited soak

**Test 4.15: Damage Pool Roll**
- **Goal**: Roll damage dice for attack
- **Input**: `{ "pool_size": 4, "damage_type": "lethal" }`
- **Expected**: Each success = 1 health level of damage

**Test 4.16: Bashing Damage Pool**
- **Goal**: Roll bashing damage
- **Input**: `{ "pool_size": 3, "damage_type": "bashing" }`
- **Expected**: Bashing damage calculated correctly

---

### Game-Line Specific Mechanics

#### `roll_virtue_check` (Vampire)
**Test 4.17: Self-Control Check**
- **Goal**: Test frenzy resistance
- **Input**: `{ "character_id": <vampire_ID>, "virtue_name": "self-control", "difficulty": 8 }`
- **Expected**: Virtue roll result with frenzy/success indication

**Test 4.18: Courage Check**
- **Goal**: Test Rötschreck resistance
- **Input**: `{ "character_id": <vampire_ID>, "virtue_name": "courage", "difficulty": 7 }`
- **Expected**: Courage roll with fear response indication

**Test 4.19: Conscience Check**
- **Goal**: Test humanity loss resistance
- **Input**: `{ "character_id": <vampire_ID>, "virtue_name": "conscience", "difficulty": 6 }`
- **Expected**: Conscience roll with humanity implications

#### `change_form` (Werewolf)
**Test 4.20: Shift to Crinos**
- **Goal**: Transform to war form
- **Input**: `{ "character_id": <werewolf_ID>, "target_form": "Crinos" }`
- **Expected**: Form change with attribute modifiers (+4 Str, +1 Dex, +3 Sta, etc.)

**Test 4.21: Shift to Lupus**
- **Goal**: Transform to wolf form
- **Input**: `{ "character_id": <werewolf_ID>, "target_form": "Lupus" }`
- **Expected**: Wolf form modifiers (+1 Dex, +2 Sta, +1 Perception)

**Test 4.22: Shift to Homid**
- **Goal**: Return to human form
- **Input**: `{ "character_id": <werewolf_ID>, "target_form": "Homid" }`
- **Expected**: Human form (no modifiers)

#### `spend_rage_for_extra_actions`
**Test 4.23: Spend Rage for Actions**
- **Goal**: Werewolf gains extra actions
- **Input**: `{ "character_id": <werewolf_ID>, "rage_spent": 2 }`
- **Expected**: 2 extra actions granted, rage reduced

**Test 4.24: Validation - Insufficient Rage**
- **Goal**: Prevent overspending rage
- **Input**: Try to spend more rage than character has
- **Expected**: Error about insufficient rage

#### `roll_magick_effect` (Mage)
**Test 4.25: Coincidental Magick**
- **Goal**: Roll subtle magick effect
- **Input**: `{ "character_id": <mage_ID>, "spheres": ["Forces"], "arete_roll_pool": 4, "difficulty": 6, "is_coincidental": true }`
- **Expected**: Magick roll with minimal paradox risk

**Test 4.26: Vulgar Magick**
- **Goal**: Roll obvious magick effect
- **Input**: `{ "character_id": <mage_ID>, "spheres": ["Forces", "Prime"], "arete_roll_pool": 5, "difficulty": 7, "is_coincidental": false }`
- **Expected**: Magick roll with paradox accumulation

**Test 4.27: Vulgar Magick Failure**
- **Goal**: Test paradox on failed vulgar magick
- **Input**: Simulate failed vulgar magick roll
- **Expected**: Significant paradox points and backlash description

**Test 4.28: Magick Botch**
- **Goal**: Test catastrophic magick failure
- **Input**: Simulate botched magick roll
- **Expected**: Severe paradox backlash with narrative consequences

#### `invoke_cantrip` (Changeling)
**Test 4.29: Basic Cantrip**
- **Goal**: Roll Art + Realm for cantrip
- **Input**: `{ "character_id": <changeling_ID>, "art_pool": 3, "realm_pool": 2, "difficulty": 7 }`
- **Expected**: Combined pool of 5 dice rolled

**Test 4.30: Cantrip with High Banality**
- **Goal**: Test cantrip in high banality environment
- **Input**: `{ "character_id": <changeling_ID>, "art_pool": 2, "realm_pool": 1, "difficulty": 9 }`
- **Expected**: Higher difficulty due to banality

**Test 4.31: Cantrip Botch**
- **Goal**: Test banality consequences of botch
- **Input**: Simulate botched cantrip roll
- **Expected**: Botch result with banality increase warning

---

### Social Combat

#### `roll_social_combat`
**Test 4.32: Intimidation vs Willpower**
- **Goal**: Test social intimidation
- **Input**: `{ "attacker_name": "Marcus", "attacker_pool": 6, "target_name": "Sheriff", "target_pool": 4, "attack_type": "intimidation" }`
- **Expected**: Contested social roll with intimidation result

**Test 4.33: Persuasion Attack**
- **Goal**: Test social persuasion
- **Input**: `{ "attacker_name": "Alice", "attacker_pool": 5, "target_name": "Bob", "target_pool": 3, "attack_type": "persuasion" }`
- **Expected**: Persuasion attempt with social damage calculation

**Test 4.34: Seduction**
- **Goal**: Test seduction social combat
- **Input**: `{ "attacker_name": "Toreador", "attacker_pool": 7, "target_name": "Mortal", "target_pool": 2, "attack_type": "seduction" }`
- **Expected**: Seduction roll with effect based on net successes

**Test 4.35: Social Combat Tie**
- **Goal**: Handle tied social combat
- **Input**: Arrange for equal successes in social combat
- **Expected**: Tie resolution with stalemate or re-roll suggestion

**Test 4.36: Social Botch**
- **Goal**: Test social combat botch consequences
- **Input**: Simulate social combat botch
- **Expected**: Botch consequences with relationship damage description

---

## Success Criteria
- All dice mechanics follow World of Darkness rules correctly
- Specialty rules work properly (10s = 2 successes)
- Contested actions calculate net successes accurately
- Soak and damage rolls use correct dice pools
- Game-line specific mechanics work for each splat
- Social combat provides meaningful results
- All botch and failure conditions are handled properly
- Paradox and banality systems function correctly

## Dependencies
- Requires characters of different game lines from Test Block 1
- May reference character resources from Test Block 2
- Should be run before initiative/turn management tests
