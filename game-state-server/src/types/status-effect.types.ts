export interface StatusEffect {
  id: number;
  character_id?: number;
  npc_id?: number;
  effect_name: string;
  description?: string;
  mechanical_effect?: any;
  duration_type: string;
  duration_value?: number;
}