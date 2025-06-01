# Dice Rolling Guide for RPG MCP Servers

## Basic Dice Notation

### Standard Rolls
- `1d20` - Roll one 20-sided die
- `3d6` - Roll three 6-sided dice and sum them
- `1d20+5` - Roll 1d20 and add 5
- `2d8-2` - Roll 2d8 and subtract 2

### Advantage/Disadvantage Notation
- `2d20kh1` - Roll 2d20, keep highest 1 (advantage)
- `2d20kl1` - Roll 2d20, keep lowest 1 (disadvantage)
- `2d20kh1+5` - Roll with advantage, add 5
- `2d20kl1+3` - Roll with disadvantage, add 3

## Available Tools

### 1. `roll_dice` - Generic dice rolling
Use for any dice roll with full notation support:
```json
{
  "notation": "2d20kh1+5",
  "reason": "Perception check with advantage"
}
```

### 2. `roll_check` - Ability/Skill checks
Simplified tool for ability checks:
```json
{
  "character": "Thorin",
  "ability": "Perception",
  "modifier": 5,
  "advantage": true,
  "dc": 15  // optional
}
```

### 3. `attack_roll` - Combat attacks
Specifically for attack rolls:
```json
{
  "attacker": "Thorin",
  "target": "Goblin",
  "modifier": 7,
  "advantage": false,
  "disadvantage": false
}
```

### 4. `saving_throw` - Saving throws
For saves against effects:
```json
{
  "character": "Thorin",
  "ability": "Constitution",
  "dc": 13,
  "modifier": 5
}
```

## Examples

### Rolling with Advantage (Two Ways)

**Method 1: Using dice notation**
```
roll_dice with notation "2d20kh1+5" for "Stealth check with advantage"
```
Output shows all rolls: `rolled [15, 8], kept [15]+5 = 20`

**Method 2: Using roll_check**
```
roll_check for character "Elara", ability "Stealth", modifier 5, advantage true
```
Output clearly shows the advantage was applied

### Complex Rolls

**Fireball damage (many dice)**
```
roll_dice with notation "8d6" for "Fireball damage"
```

**Great Weapon Fighting (keep specific dice)**
```
roll_dice with notation "2d6kh1" for "Greatsword damage, rerolling low die"
```

## Tips

1. **For ability checks**: Use `roll_check` - it's cleaner and tracks success/failure
2. **For damage**: Use `roll_dice` with appropriate notation
3. **For attacks**: Use `attack_roll` - it handles crits/fumbles properly
4. **For complex rolls**: The notation system supports any combination

## Common D&D 5e Rolls

- **Ability Check**: `1d20 + ability modifier`
- **Attack Roll**: `1d20 + proficiency + ability modifier`
- **Damage Roll**: Varies by weapon (e.g., `1d8+3` for longsword)
- **Saving Throw**: `1d20 + ability modifier (+ proficiency if proficient)`
- **Initiative**: `1d20 + Dexterity modifier`
- **Death Save**: `1d20` (10+ succeeds)

## Advantage/Disadvantage Rules

- **Advantage**: Roll 2d20, use the higher
- **Disadvantage**: Roll 2d20, use the lower
- **Multiple sources**: Having multiple sources of advantage/disadvantage doesn't stack
- **Cancellation**: One source of advantage and one of disadvantage cancel out

The system now properly handles all these cases!
