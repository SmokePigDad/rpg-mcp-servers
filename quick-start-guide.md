# Quick Start Guide – Storyteller System (oWoD/Chronicles of Darkness)

Welcome to the Model Context Protocol Storyteller System server suite! This quick-start will help you make characters, play scenes, roll pools, and use the powerful automation included—no D&D rules required.

---

## 1. Creating Your First Character

Prompt the AI Storyteller/DM to create a World of Darkness character:

> "I'd like to be a Brujah vampire named Marcus. My Nature is Rebel and Demeanor is Bon Vivant."

The system will use the `create_character` tool and generate a character with Storyteller System stats:
- Attributes (Physical, Social, Mental)
- Abilities (Talents, Skills, Knowledges)
- Backgrounds, Supernatural traits, and powers
- Virtues, Willpower, Blood/Vitae (or Gnosis/Glamour/etc. by splat)

---

## 2. Beginning Play & Scenes

Start your story by asking:

> "Set the scene for my first night in Chicago."

The AI will narrate a vivid oWoD environment, introduce NPCs, and invite you to act and react.

---

## 3. Rolling Dice – The Dice Pool System

Actions are resolved using dice pools:

- Most tasks = Attribute + Ability (e.g., Dexterity + Stealth)
- The AI/DM prompts or rolls d10s for you, counting results of 6+ (successes).
- Example:

> "I try to sneak past the guard."
>
> (The AI rolls Dexterity + Stealth pool and narrates success/failure.)

---

## 4. Tracking Health, Willpower, and Resources

Instead of HP, you have health levels (Bruised, Hurt, Injured, etc.), tracked using the HealthTracker system.
- Damage is applied via `apply_damage`.
- Spend and recover resources (Willpower, Vitae, Quintessence) with `spend_resource` or `restore_resource`.
- XP can be spent to improve traits via `improve_trait`.

---

## 5. Checking Your Status

At any time, ask:

> "Show me my vampire sheet."

The system will output your current:
- Attributes, abilities, backgrounds
- Health levels and penalties
- Powers, disciplines, spendable resources

---

## 6. Example System Commands

- **Create character**: `create_character`
- **Roll dice pool**: `roll_wod_pool`
- **Apply/heal damage**: `apply_damage`, `heal_damage`
- **Resource use**: `spend_resource`, `restore_resource`
- **Increase trait**: `improve_trait`
- **Show initiative**: `get_initiative_order`
- **Roll for damage**: `roll_damage_pool`

---

## 7. Immersive Play Tips

- Describe what your character intends and their emotions.
- Use your backgrounds and powers creatively.
- Rely on the AI Storyteller for system mechanics—focus on ambiance and consequences.
- Engage NPCs, make allies and enemies, and drive the story with your personal goals.

---

Have fun exploring the World of Darkness!
