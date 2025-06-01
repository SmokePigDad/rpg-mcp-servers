# AI Dungeon Master - Quick Start Guide

## Creating Your First Character

Ask the AI Dungeon Master:
> "I want to create a human fighter named Marcus"

The DM will use the `create_character` tool to set up your character with appropriate stats.

## Starting an Adventure

> "I'm ready to start my adventure. Where am I?"

The DM will set the scene and begin your story.

## Combat Example

When you encounter enemies:
> "I attack the goblin with my sword!"

The DM will:
1. Use `attack_roll` to determine if you hit
2. Use `damage_roll` to calculate damage
3. Track HP using `update_character`
4. Describe the action cinematically

## Inventory Management

> "I search the goblin's body"

The DM will use `add_item` to add any loot to your inventory.

## Checking Status

> "Show me my character sheet"

The DM will use `get_character` and `get_inventory` to display your current status.

## Tips for Best Experience

1. Be descriptive in your actions
2. Ask questions about your surroundings
3. Interact with NPCs
4. Make creative use of your abilities
5. The DM will handle all the mechanics - just focus on roleplaying!

## Example Commands the DM Uses

- **Creating a character**: `create_character({ name: "Marcus", class: "Fighter", stats: { strength: 16, dexterity: 14, constitution: 15, intelligence: 10, wisdom: 12, charisma: 8 }})`
- **Rolling initiative**: `roll_dice({ notation: "1d20+2", reason: "Marcus initiative" })`
- **Making an attack**: `attack_roll({ attacker: "Marcus", target: "Goblin", modifier: 5 })`
- **Dealing damage**: `damage_roll({ notation: "1d8+3", damage_type: "slashing" })`
- **Adding loot**: `add_item({ character_id: 1, item_name: "Health Potion", item_type: "consumable", quantity: 2 })`

Have fun adventuring!
