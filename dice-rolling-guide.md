# Dice Rolling Guide – Storyteller System (oWoD/Chronicles)

Everything in the Storyteller System (World of Darkness/Chronicles) revolves around rolling pools of 10-sided dice—not d20s!

---

## 1. Understanding Dice Pools

To attempt an action, combine one Attribute (e.g., Dexterity) with one Ability (e.g., Firearms, Stealth, Empathy):
- Dice Pool = Attribute rating + Ability rating (e.g., Dexterity 3 + Stealth 2 = 5d10 rolled)
- Sometimes, powers or equipment add extra dice.

---

## 2. How Dice Rolling Works

- Standard target number (difficulty) is 6 (sometimes higher/lower for easier/harder tasks).
- Every die that rolls a 6 or higher counts as a success.
- A 1 (one) cancels out one success (botch = all 1s and no successes).
- If you have a Specialty and roll a 10, that die counts as two successes.

---

## 3. Types of Rolls

- **Action/Task:** Attribute + Ability (e.g., Wits + Alertness)
- **Opposed/Contested:** Each side rolls their pool; whoever has more net successes wins.
- **Damage:** After a successful attack, roll a separate damage pool (e.g., Strength + weapon).
- **Initiative:** Roll one die, add relevant stats (usually Dexterity + Wits).

---

## 4. Using Automation Tools

### a) Roll a Pool
```json
{
  "tool": "roll_wod_pool",
  "pool_size": 7,
  "difficulty": 6
}
```

### b) Roll Damage
```json
{
  "tool": "roll_damage_pool",
  "pool_size": 3,
  "damage_type": "lethal"
}
```

### c) Contest Actions
```json
{
  "tool": "roll_contested_action",
  "attacker_pool": 5,
  "attacker_difficulty": 6,
  "attacker_specialty": false,
  "defender_pool": 6,
  "defender_difficulty": 6,
  "defender_specialty": true
}
```

### d) Spend Willpower for Automatic Success

Ask the MCP or AI to "spend Willpower for one automatic success" before rolling.

---

## 5. Example Prompts

- "Marcus makes a Charisma + Subterfuge roll (diff 7) to lie convincingly."
- "Roll Dexterity + Firearms for my attack."
- "How much damage do I deal? (Strength + Knife)"
- "Let me spend Willpower for my Stealth roll."
- "Contest my Perception + Empathy vs. the NPC's Manipulation + Subterfuge."

---

## 6. Tips & Special Rules

- If your pool drops to 0 dice, you may still roll 1 die, but only a 10 counts as success (and a 1 is a botch).
- The AI engine handles specialties, damage types, and edge cases—just describe your intent!

---

Use these guides and automated tools for fast, accurate Storyteller System play!
