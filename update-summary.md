# RPG MCP Servers - Update Summary

## 🔧 Fixed Issues

### 1. **Inventory Management**
Added missing tools to game-state server:
- `remove_item` - Remove items from inventory by ID
- `update_item` - Update item quantity or equipped status

Now you can fully manage inventory:
```
# Add a sword
add_item: { character_id: 1, item_name: "Longsword", quantity: 1 }

# Equip the sword (using the item's ID from inventory)
update_item: { item_id: 1, equipped: true }

# Use a potion (reduce quantity)
update_item: { item_id: 2, quantity: 1 }  // from 2 to 1

# Remove an item completely
remove_item: { item_id: 3 }
```

### 2. **Fixed Advantage/Disadvantage Mechanics**
Corrected D&D 5e rules implementation:
- **Before**: Roll 1d20+mod twice, compare totals (wrong)
- **After**: Roll 2d20, take highest/lowest, THEN add modifier (correct)

Example output now shows all rolls:
```json
{
  "total": 17,          // Final result (d20 + modifier)
  "d20": 15,           // The d20 that was used
  "modifier": 2,       // Modifier added once
  "allRolls": [15, 8], // Both d20s rolled
  "advantage": true,
  "critical": false,
  "fumble": false
}
```

### 3. **Added Initiative Roll**
New tool for combat management:
- `initiative_roll` - Roll initiative with character name and modifier
- Returns structured data for easy sorting

## 📝 Updated Tool Lists

### Game State Server Tools:
- create_character
- get_character
- get_character_by_name
- list_characters
- update_character
- add_item
- get_inventory
- **remove_item** (NEW)
- **update_item** (NEW)
- save_world_state
- get_world_state

### Combat Engine Tools:
- roll_dice
- attack_roll (FIXED)
- **initiative_roll** (NEW)
- damage_roll
- saving_throw
- get_combat_log
- clear_combat_log

## 🚀 To Apply Updates

1. Rebuild the servers:
   ```bash
   cd C:\Users\mnehm\AppData\Roaming\Roo-Code\MCP\rpg-mcp-servers
   rebuild.bat
   ```

2. Restart Roo Code and Claude Desktop

3. The updated tools will be immediately available!

## ✅ Testing the Fixes

### Test Inventory Management:
```
1. Add a healing potion (quantity: 3)
2. Use one potion (update quantity to 2)
3. Remove empty vial from inventory
```

### Test Combat Mechanics:
```
1. Roll attack with advantage
2. Check that it shows both d20 rolls
3. Verify only one modifier is added to the final total
```

The servers now properly support full D&D 5e mechanics!
