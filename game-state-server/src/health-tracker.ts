// File: game-state-server/src/health-tracker.ts

/**
 * HealthTracker handles World of Darkness health-level tracking,
 * including damage application, wound penalties, serialization,
 * and robust fallback for malformed/corrupt health state objects.
 */
type DamageType = 'bashing' | 'lethal' | 'aggravated';
import { HealthLevel, DamageObject } from './types/health.types.js';

const HEALTH_LEVELS: HealthLevel[] = [
  'bruised',
  'hurt',
  'injured',
  'wounded',
  'mauled',
  'crippled',
  'incapacitated'
];

const PENALTIES: Record<HealthLevel, number> = {
  bruised: 0,
  hurt: -1,
  injured: -1,
  wounded: -2,
  mauled: -2,
  crippled: -5,
  incapacitated: 0
};

const DAMAGE_SYMBOL: Record<DamageType, string> = {
  bashing: '/',
  lethal: 'X',
  aggravated: '*'
};


export class HealthTracker {
  private boxes: ('' | '/' | 'X' | '*')[] = Array(7).fill('');
  /**
   * Initializes with a JSON or record describing the current health boxes.
   * Accepts both V20 object and count formats. Handles corrupted state robustly.
   */
  constructor(public health: any = undefined) {
    this.deserializeBoxArray(health);
  }

  private fallbackFullHealth() {
    this.boxes = Array(7).fill('');
  }

  /**
   * Accepts legacy/modern JSON, string, or nothing; parses to 7-boxes.
   */
  private deserializeBoxArray(source: any) {
    let healthObj: Record<string, any>;
    try {
      if (typeof source === 'string') {
        healthObj = JSON.parse(source ?? '{}');
      } else if (typeof source === 'object' && source) {
        healthObj = source;
      } else {
        throw new Error();
      }
      if (typeof healthObj !== 'object' || healthObj === null) throw new Error();
    } catch (e) {
      healthObj = HEALTH_LEVELS.reduce((acc, lvl) => {
        acc[lvl] = {};
        return acc;
      }, {} as any);
    }
    // preferred fill-in per box: support V20 {b:1,l:0,a:0} or just number (count of filled damage)
    const out: ('' | '/' | 'X' | '*')[] = [];
    for (const lvl of HEALTH_LEVELS) {
      let boxVal = healthObj[lvl];
      if (typeof boxVal === 'object' && boxVal !== null) {
        // V20 style: {b:1,l:0,a:0}
        if (boxVal.a > 0) out.push('*');
        else if (boxVal.l > 0) out.push('X');
        else if (boxVal.b > 0) out.push('/');
        else out.push('');
      } else if (typeof boxVal === 'number') {
        // Simple number: count of filled boxes, no type
        out.push(boxVal > 0 ? '/' : '');
      } else {
        out.push('');
      }
    }
    // If corrupt, fallback
    if (out.length !== HEALTH_LEVELS.length || out.some(x => typeof x !== 'string' || x.length > 1)) {
      this.fallbackFullHealth();
    } else {
      this.boxes = out;
    }
  }

  /**
   * Returns simple JSON health object (V20 style, e.g. {bruised: {b:1}, ...})
   */
  public toJSON(): Record<HealthLevel, any> {
    const out: Record<HealthLevel, any> = {} as any;
    for (let i = 0; i < HEALTH_LEVELS.length; ++i) {
      const symbol = this.boxes[i];
      if (symbol === '*') out[HEALTH_LEVELS[i]] = { a: 1 };
      else if (symbol === 'X') out[HEALTH_LEVELS[i]] = { l: 1 };
      else if (symbol === '/') out[HEALTH_LEVELS[i]] = { b: 1 };
      else out[HEALTH_LEVELS[i]] = {};
    }
    return out;
  }

  /**
   * Returns printable visual status: e.g. "/|*|/|X|...|"
   */
  public getBoxArray(): ('' | '/' | 'X' | '*')[] {
    return [...this.boxes];
  }

  /** Returns wound penalty for current state according to most severe filled box. */
  public getWoundPenalty(): number {
    for (let i = this.boxes.length - 1; i >= 0; --i) {
      if (this.boxes[i] !== '') {
        return PENALTIES[HEALTH_LEVELS[i]];
      }
    }
    return 0;
  }

  /** Returns true if the character is incapacitated (incapacitated health level is filled). */
  public isIncapacitated(): boolean {
    return this.boxes[6] !== ''; // incapacitated is the 7th (index 6) health level
  }

  /** Returns the current health status as a descriptive string. */
  public getHealthStatus(): string {
    if (this.isIncapacitated()) {
      return 'Incapacitated';
    }

    for (let i = this.boxes.length - 1; i >= 0; --i) {
      if (this.boxes[i] !== '') {
        return HEALTH_LEVELS[i].charAt(0).toUpperCase() + HEALTH_LEVELS[i].slice(1);
      }
    }
    return 'Healthy';
  }

  /** Applies any combination of bashing, lethal, aggravated (any falsy is 0). Returns {changed: bool}. */
  public applyDamage(dmg: DamageObject): boolean {
    let orig = this.getBoxArray().join('');
    // Application order: aggravated > lethal > bashing
    const applyType = (count: number, symbol: '/' | 'X' | '*') => {
      for (let i = 0; i < (count || 0); ++i) {
        // aggravated: first '', then upgrade '/' or 'X' to '*'
        // lethal: first '', then upgrade '/' to 'X'
        // bashing: first '', only
        let idx = -1;
        if (symbol === '*') {
          idx = this.boxes.findIndex(x => x === '' || x === '/' || x === 'X');
        } else if (symbol === 'X') {
          idx = this.boxes.findIndex(x => x === '' || x === '/');
        } else if (symbol === '/') {
          idx = this.boxes.findIndex(x => x === '');
        }
        if (idx !== -1) {
          // Upgrading existing
          if (
            this.boxes[idx] === '' ||
            (symbol === 'X' && this.boxes[idx] === '/') ||
            (symbol === '*' && (this.boxes[idx] === '/' || this.boxes[idx] === 'X'))
          ) {
            this.boxes[idx] = symbol;
          }
        }
      }
    };

    applyType(dmg.aggravated || 0, '*');
    applyType(dmg.lethal || 0, 'X');
    applyType(dmg.bashing || 0, '/');

    // overflow: if >7, last become aggravated
    let over = this.boxes.filter(c => c === '*' || c === 'X' || c === '/').length - 7;
    if (over > 0) {
      for (let i = this.boxes.length - 1; i >= 0 && over > 0; --i) {
        if (this.boxes[i] !== '*') {
          this.boxes[i] = '*';
          over--;
        }
      }
    }
    return this.getBoxArray().join('') !== orig;
  }

  /**
   * Serializes to JSON-string.
   */
  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  /**
   * Static: build from DB (object or JSON-string) and always get a valid instance.
   */
  static from(source: any): HealthTracker {
    return new HealthTracker(source);
  }

  /**
   * Static: returns a fully healthy instance.
   */
  static healthy(): HealthTracker {
    return new HealthTracker();
  }
}