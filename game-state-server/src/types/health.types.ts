export type DamageType = 'bashing' | 'lethal' | 'aggravated';

export type HealthLevel =
  | 'bruised'
  | 'hurt'
  | 'injured'
  | 'wounded'
  | 'mauled'
  | 'crippled'
  | 'incapacitated';

export interface DamageObject {
  aggravated?: number;
  lethal?: number;
  bashing?: number;
}