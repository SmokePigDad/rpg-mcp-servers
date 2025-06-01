export interface DiceRoll {
  dice: string;
  rolls: number[];
  modifier: number;
  total: number;
  expression: string;
}

export interface CombatRoll {
  attackRoll: DiceRoll;
  hit: boolean;
  critical: boolean;
  fumble: boolean;
  damageRoll?: DiceRoll;
}

export class DiceEngine {
  /**
   * Parse a dice expression like "1d20+5" or "3d6-2"
   */
  private parseDiceExpression(expression: string): {
    count: number;
    sides: number;
    modifier: number;
  } {
    const match = expression.match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
    if (!match) {
      throw new Error(`Invalid dice expression: ${expression}`);
    }

    const count = match[1] ? parseInt(match[1]) : 1;
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;

    return { count, sides, modifier };
  }

  /**
   * Roll a single die
   */
  private rollDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }

  /**
   * Roll dice based on expression (e.g., "1d20+5", "3d6-2")
   */
  roll(expression: string): DiceRoll {
    const { count, sides, modifier } = this.parseDiceExpression(expression);
    const rolls: number[] = [];
    
    for (let i = 0; i < count; i++) {
      rolls.push(this.rollDie(sides));
    }
    
    const sum = rolls.reduce((acc, val) => acc + val, 0);
    const total = sum + modifier;
    
    return {
      dice: `${count}d${sides}`,
      rolls,
      modifier,
      total,
      expression,
    };
  }

  /**
   * Roll multiple dice expressions and sum them
   */
  rollMultiple(expressions: string[]): DiceRoll {
    const allRolls: number[] = [];
    let totalModifier = 0;
    const diceParts: string[] = [];
    
    for (const expr of expressions) {
      const result = this.roll(expr);
      allRolls.push(...result.rolls);
      totalModifier += result.modifier;
      diceParts.push(result.dice);
    }
    
    const sum = allRolls.reduce((acc, val) => acc + val, 0);
    const total = sum + totalModifier;
    
    return {
      dice: diceParts.join('+'),
      rolls: allRolls,
      modifier: totalModifier,
      total,
      expression: expressions.join('+'),
    };
  }

  /**
   * Roll with advantage (roll twice, take higher)
   */
  rollAdvantage(expression: string): DiceRoll {
    const roll1 = this.roll(expression);
    const roll2 = this.roll(expression);
    
    const chosen = roll1.total >= roll2.total ? roll1 : roll2;
    return {
      ...chosen,
      expression: `${expression} (advantage)`,
    };
  }

  /**
   * Roll with disadvantage (roll twice, take lower)
   */
  rollDisadvantage(expression: string): DiceRoll {
    const roll1 = this.roll(expression);
    const roll2 = this.roll(expression);
    
    const chosen = roll1.total <= roll2.total ? roll1 : roll2;
    return {
      ...chosen,
      expression: `${expression} (disadvantage)`,
    };
  }

  /**
   * Perform an attack roll
   */
  attackRoll(
    attackBonus: number,
    targetAC: number,
    advantage: boolean = false,
    disadvantage: boolean = false
  ): CombatRoll {
    const expression = `1d20+${attackBonus}`;
    
    let attackRoll: DiceRoll;
    if (advantage && !disadvantage) {
      attackRoll = this.rollAdvantage(expression);
    } else if (disadvantage && !advantage) {
      attackRoll = this.rollDisadvantage(expression);
    } else {
      attackRoll = this.roll(expression);
    }
    
    const d20Roll = attackRoll.rolls[0];
    const critical = d20Roll === 20;
    const fumble = d20Roll === 1;
    const hit = critical || (!fumble && attackRoll.total >= targetAC);
    
    return {
      attackRoll,
      hit,
      critical,
      fumble,
    };
  }

  /**
   * Roll damage for an attack
   */
  damageRoll(damageExpression: string, critical: boolean = false): DiceRoll {
    if (critical) {
      // Double the dice on critical hit
      const { count, sides, modifier } = this.parseDiceExpression(damageExpression);
      const critExpression = `${count * 2}d${sides}+${modifier}`;
      const result = this.roll(critExpression);
      return {
        ...result,
        expression: `${damageExpression} (critical)`,
      };
    }
    
    return this.roll(damageExpression);
  }

  /**
   * Perform a saving throw
   */
  savingThrow(
    saveBonus: number,
    dc: number,
    advantage: boolean = false,
    disadvantage: boolean = false
  ): {
    roll: DiceRoll;
    success: boolean;
    criticalSuccess: boolean;
    criticalFailure: boolean;
  } {
    const expression = `1d20+${saveBonus}`;
    
    let roll: DiceRoll;
    if (advantage && !disadvantage) {
      roll = this.rollAdvantage(expression);
    } else if (disadvantage && !advantage) {
      roll = this.rollDisadvantage(expression);
    } else {
      roll = this.roll(expression);
    }
    
    const d20Roll = roll.rolls[0];
    const criticalSuccess = d20Roll === 20;
    const criticalFailure = d20Roll === 1;
    const success = criticalSuccess || (!criticalFailure && roll.total >= dc);
    
    return {
      roll,
      success,
      criticalSuccess,
      criticalFailure,
    };
  }

  /**
   * Roll initiative for combat order
   */
  initiative(dexterityModifier: number): DiceRoll {
    return this.roll(`1d20+${dexterityModifier}`);
  }

  /**
   * Roll for ability check
   */
  abilityCheck(
    abilityModifier: number,
    proficiencyBonus: number = 0,
    dc: number,
    advantage: boolean = false,
    disadvantage: boolean = false
  ): {
    roll: DiceRoll;
    success: boolean;
    criticalSuccess: boolean;
    criticalFailure: boolean;
  } {
    const totalBonus = abilityModifier + proficiencyBonus;
    return this.savingThrow(totalBonus, dc, advantage, disadvantage);
  }
}
