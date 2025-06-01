# Roll Examples - Old vs New

## Ability Check with Advantage

### ❌ Old Way (Confusing)
```
User: "I want to make a Perception check with advantage"
DM: "Roll 2d20kh1+5"
Result: Unclear what happened, notation is cryptic
```

### ✅ New Way (Clear)
```
User: "I want to make a Perception check with advantage"
DM uses: roll_check(character="Thorin", ability="Perception", modifier=5, advantage=true)
Result: 
{
  "character": "Thorin",
  "ability": "Perception",
  "total": 23,
  "rolls": [18, 11],
  "kept": [18],
  "advantage": true
}
```

## Attack Roll Comparison

### ❌ Old Attack with Advantage
```
attack_roll(modifier=5, advantage=true)
Result: Rolled 1d20+5 twice, then added modifiers to both (wrong!)
Total could be inflated by double modifier
```

### ✅ New Attack with Advantage  
```
attack_roll(modifier=5, advantage=true)
Result: 
{
  "total": 18,        // Only one modifier added
  "d20": 13,          // The d20 that was kept
  "allRolls": [13, 7], // Both d20s shown
  "advantage": true
}
```

## Direct Dice Notation

### Now Supports Standard D&D Notation
- `1d20` - Simple roll
- `3d6+2` - Multiple dice with modifier
- `2d20kh1` - Keep highest (advantage)
- `2d20kl1` - Keep lowest (disadvantage)
- `4d6kh3` - Roll 4d6, keep highest 3 (ability scores)

### Example: Rolling for Stats
```
roll_dice("4d6kh3")
Result: rolled [6, 4, 4, 2], kept [6, 4, 4] = 14
```

## Why This Matters

1. **Follows D&D 5e Rules**: Advantage/disadvantage work correctly
2. **Clear Output**: See all rolls and understand what happened
3. **Flexible Options**: Use simple tools or advanced notation
4. **Better for Storytelling**: DM can focus on narrative, not math

## Quick Reference

**For Ability Checks**: Use `roll_check`
**For Attacks**: Use `attack_roll` 
**For Damage**: Use `damage_roll`
**For Anything Else**: Use `roll_dice` with notation
