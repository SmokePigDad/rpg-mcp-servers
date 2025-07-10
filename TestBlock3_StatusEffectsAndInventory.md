# Test Block 3: Status Effects & Inventory Management

## Overview
This test block covers the status effects system for tracking temporary conditions and the inventory management system for character equipment and items.

## Tools Covered
- `apply_status_effect`
- `remove_status_effect`
- `get_status_effects`
- `add_item`
- `get_inventory`
- `update_item`
- `remove_item`

---

## Test Cases

### Status Effects System

#### `apply_status_effect`
**Test 3.1: Apply Temporary Status Effect**
- **Goal**: Apply a temporary condition to character
- **Input**: `{ "target_type": "character", "target_id": <ID>, "effect_name": "Stunned", "description": "Cannot act this round", "duration_type": "rounds", "duration_value": 1 }`
- **Expected**: Status effect applied with unique effect ID returned

**Test 3.2: Apply Permanent Status Effect**
- **Goal**: Apply indefinite condition
- **Input**: `{ "target_type": "character", "target_id": <ID>, "effect_name": "Cursed", "description": "Haunted by spirits", "duration_type": "indefinite" }`
- **Expected**: Permanent effect applied with no expiration

**Test 3.3: Apply Effect with Mechanical Modifiers**
- **Goal**: Apply effect with game mechanics
- **Input**: `{ "target_type": "character", "target_id": <ID>, "effect_name": "Wounded", "mechanical_effect": { "dice_penalty": -2, "movement_halved": true }, "duration_type": "scenes", "duration_value": 3 }`
- **Expected**: Effect includes mechanical data in JSON format

**Test 3.4: Apply Effect to Antagonist**
- **Goal**: Apply status effect to NPC
- **Input**: `{ "target_type": "npc", "target_id": <antagonist_ID>, "effect_name": "Frenzied", "description": "Lost to Beast" }`
- **Expected**: Effect applied to antagonist successfully

**Test 3.5: Validation - Invalid Target**
- **Goal**: Reject effect on nonexistent target
- **Input**: `{ "target_type": "character", "target_id": 99999, "effect_name": "Test" }`
- **Expected**: Error: "Character not found" or similar

#### `get_status_effects`
**Test 3.6: List Character Effects**
- **Goal**: Retrieve all effects on a character
- **Input**: `{ "target_type": "character", "target_id": <ID> }`
- **Expected**: Array of all active effects with full details

**Test 3.7: List Antagonist Effects**
- **Goal**: Retrieve effects on an antagonist
- **Input**: `{ "target_type": "npc", "target_id": <antagonist_ID> }`
- **Expected**: Array of antagonist's active effects

**Test 3.8: Empty Effects List**
- **Goal**: Handle target with no effects
- **Input**: Get effects for character with no applied effects
- **Expected**: Empty array or "No effects" message

#### `remove_status_effect`
**Test 3.9: Remove Specific Effect**
- **Goal**: Remove an effect by its ID
- **Input**: `{ "effect_id": <effect_ID_from_test_3.1> }`
- **Expected**: Effect removed, no longer appears in get_status_effects

**Test 3.10: Remove Nonexistent Effect**
- **Goal**: Handle removal of missing effect
- **Input**: `{ "effect_id": 99999 }`
- **Expected**: Error: "Status effect not found" or similar

**Test 3.11: Verify Effect Removal**
- **Goal**: Confirm effect is actually removed
- **Input**: Apply effect, remove it, then list effects
- **Expected**: Effect no longer in the list

---

### Inventory Management

#### `add_item`
**Test 3.12: Add Basic Item**
- **Goal**: Add simple item to character inventory
- **Input**: `{ "character_id": <ID>, "item": { "name": "Healing Potion", "description": "Restores 3 health levels", "quantity": 2, "type": "consumable" } }`
- **Expected**: Item added successfully, appears in get_inventory

**Test 3.13: Add Weapon**
- **Goal**: Add weapon with combat stats
- **Input**: `{ "character_id": <ID>, "item": { "name": "Silver Dagger", "description": "Blessed silver blade", "quantity": 1, "type": "weapon", "damage": "+2 lethal" } }`
- **Expected**: Weapon added with all properties

**Test 3.14: Add Equipment**
- **Goal**: Add armor or protective gear
- **Input**: `{ "character_id": <ID>, "item": { "name": "Kevlar Vest", "description": "Modern body armor", "quantity": 1, "type": "armor", "protection": "+2 soak vs bullets" } }`
- **Expected**: Armor added with protection stats

**Test 3.15: Validation - Invalid Character**
- **Goal**: Reject item addition to nonexistent character
- **Input**: `{ "character_id": 99999, "item": { "name": "Test Item" } }`
- **Expected**: Error: "Character not found"

#### `get_inventory`
**Test 3.16: Get Full Inventory**
- **Goal**: Retrieve all items for a character
- **Input**: `{ "character_id": <ID> }`
- **Expected**: Formatted list of all items with quantities and descriptions

**Test 3.17: Empty Inventory**
- **Goal**: Handle character with no items
- **Input**: Get inventory for character with no items
- **Expected**: Empty list or "No items" message

#### `update_item`
**Test 3.18: Update Item Quantity**
- **Goal**: Modify item quantity (e.g., after use)
- **Input**: `{ "item_id": <potion_ID>, "updates": { "quantity": 1 } }`
- **Expected**: Potion quantity reduced from 2 to 1

**Test 3.19: Equip Item**
- **Goal**: Mark item as equipped
- **Input**: `{ "item_id": <dagger_ID>, "updates": { "equipped": true } }`
- **Expected**: Dagger marked as equipped

**Test 3.20: Update Item Description**
- **Goal**: Modify item description or properties
- **Input**: `{ "item_id": <dagger_ID>, "updates": { "description": "Enchanted silver blade +1" } }`
- **Expected**: Item description updated

**Test 3.21: Multiple Property Update**
- **Goal**: Update multiple item properties at once
- **Input**: `{ "item_id": <vest_ID>, "updates": { "equipped": true, "description": "Worn kevlar vest", "condition": "good" } }`
- **Expected**: All properties updated successfully

**Test 3.22: Validation - Invalid Item**
- **Goal**: Reject update of nonexistent item
- **Input**: `{ "item_id": 99999, "updates": { "quantity": 1 } }`
- **Expected**: Error: "Item not found"

#### `remove_item`
**Test 3.23: Remove Item by ID**
- **Goal**: Delete an item from inventory
- **Input**: `{ "item_id": <potion_ID> }`
- **Expected**: Item removed, no longer appears in get_inventory

**Test 3.24: Remove Nonexistent Item**
- **Goal**: Handle removal of missing item
- **Input**: `{ "item_id": 99999 }`
- **Expected**: Error: "Item not found"

**Test 3.25: Verify Item Removal**
- **Goal**: Confirm item is actually removed
- **Input**: Add item, remove it, then get inventory
- **Expected**: Item no longer in inventory list

---

### Integration Tests

**Test 3.26: Status Effect Persistence**
- **Goal**: Verify effects persist across character retrieval
- **Input**: Apply effect, then get_character
- **Expected**: Character sheet includes active status effects

**Test 3.27: Inventory Persistence**
- **Goal**: Verify inventory persists across sessions
- **Input**: Add items, then get_character
- **Expected**: Character sheet includes inventory items

**Test 3.28: Effect on Multiple Targets**
- **Goal**: Apply same effect type to character and antagonist
- **Input**: Apply "Stunned" to both character and NPC
- **Expected**: Both targets show the effect independently

**Test 3.29: Item Quantity Management**
- **Goal**: Test complete item lifecycle
- **Input**: Add item with quantity 3, update to 2, update to 1, remove
- **Expected**: Each step works correctly, final removal succeeds

**Test 3.30: Cross-Character Inventory**
- **Goal**: Verify inventory isolation between characters
- **Input**: Add items to multiple characters
- **Expected**: Each character's inventory is separate and correct

---

## Success Criteria
- Status effects can be applied, retrieved, and removed correctly
- Effects work on both characters and antagonists
- Mechanical effects are stored and retrieved as JSON
- Inventory operations work for all item types
- Item properties can be updated individually or in groups
- All validation prevents invalid operations
- Data persists correctly across operations

## Dependencies
- Requires characters and antagonists from Test Block 1
- Some tests may reference characters with existing damage from Test Block 2
