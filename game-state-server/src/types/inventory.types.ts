export interface InventoryItem {
  id: number;
  character_id: number;
  item_name: string;
  item_type: string;
  quantity: number;
  description?: string;
  properties?: any;
  equipped: boolean;
  condition: string;
  last_modified: string;
}