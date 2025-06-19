// World of Darkness Dice Pool Engine

export interface DicePoolResult {
    poolSize: number;
    difficulty: number;
    rolls: number[];
    successes: number;
    isBotch: boolean;
    specialtySuccesses: number; // How many successes came from specialty 10s
    cancellations: number;     // How many 1s cancelled successes
}

export class DiceEngine {
    /**
     * Rolls a d10 dice pool and counts successes according to Storyteller System rules.
     * @param poolSize The number of d10s to roll.
     * @param difficulty The target number for a success (e.g., 6).
     * @param hasSpecialty If true, 10s count as two successes.
     */
    roll(poolSize: number, difficulty: number, hasSpecialty: boolean = false): DicePoolResult {
        // Handle a "chance die" roll for a pool size of 0.
        if (poolSize <= 0) {
            const roll = this.rollDie();
            const isBotch = roll === 1;
            const successes = (roll >= difficulty) ? 1 : 0;
            return {
                poolSize: 0,
                difficulty,
                rolls: [roll],
                successes,
                isBotch,
                specialtySuccesses: 0,
                cancellations: 0,
            };
        }

        const rolls: number[] = Array.from({ length: poolSize }, () => this.rollDie());

        let successes = 0;
        let specialtySuccesses = 0;
        let ones = 0;

        rolls.forEach(roll => {
            if (roll >= difficulty) {
                successes++;
                // In oWoD, a specialty only adds one extra success for each 10, it doesn't double all successes.
                if (hasSpecialty && roll === 10) {
                    specialtySuccesses++;
                }
            } else if (roll === 1) {
                ones++;
            }
        });

        const totalSuccesses = successes + specialtySuccesses;
        const netSuccesses = totalSuccesses - ones;
        const isBotch = netSuccesses < 0;

        return {
            poolSize,
            difficulty,
            rolls,
            successes: isBotch ? 0 : Math.max(0, netSuccesses),
            isBotch,
            specialtySuccesses,
            cancellations: Math.min(ones, totalSuccesses),
        };
    }

    private rollDie(): number {
        return Math.floor(Math.random() * 10) + 1;
    }
}
