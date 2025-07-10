import Database from 'better-sqlite3';
import type { InventoryItem } from '../types/index.js';

export class InventoryRepository {
  private db: Database.Database;
constructor(db: Database.Database) {
    this.db = db;
  }
  
  add(character_id: number, item: any): any {
    const stmt = this.db.prepare(`
      INSERT INTO inventory (character_id, item_name, item_type, quantity, description, properties)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      character_id,
      item.name,
      item.type || 'misc',
      item.quantity || 1,
      item.description || null,
      item.properties ? JSON.stringify(item.properties) : null
    );
    return { id: result.lastInsertRowid, ...item };
  }

  getInventory(character_id: number): InventoryItem[] {
    const stmt = this.db.prepare('SELECT * FROM inventory WHERE character_id = ?');
    const rows = stmt.all(character_id);
    return rows.map(row => {
      const r = row as any;
      return {
        id: r.id,
        character_id: r.character_id,
        item_name: r.item_name,
        item_type: r.item_type,
        quantity: r.quantity,
        description: r.description,
        properties: r.properties ? JSON.parse(r.properties) : null,
        equipped: r.equipped,
        condition: r.condition,
        last_modified: r.last_modified
      }
    });
  }

  private getInventoryItemById(item_id: number): InventoryItem | null {
    const stmt = this.db.prepare('SELECT * FROM inventory WHERE id = ?');
    const row = stmt.get(item_id) as any;
    if (!row) return null;
    return {
      id: row.id,
      character_id: row.character_id,
      item_name: row.item_name,
      item_type: row.item_type,
      quantity: row.quantity,
      description: row.description,
      properties: row.properties ? JSON.parse(row.properties) : null,
      equipped: row.equipped,
      condition: row.condition,
      last_modified: row.last_modified
    };
  }

  updateItem(item_id: number, updates: any): any {
    const allowedFields = Object.keys(updates).filter(key => key !== "id");
    if (allowedFields.length === 0) {
      return this.getInventoryItemById(item_id);
    }

    const setClause = allowedFields.map(field => `${field} = ?`).join(', ');
    const values = allowedFields.map(field => (updates as any)[field]);

    const stmt = this.db.prepare(`UPDATE inventory SET ${setClause} WHERE id = ?`);
    stmt.run(...values, item_id);

    return this.getInventoryItemById(item_id);
  }

  removeItem(item_id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM inventory WHERE id = ?');
    const res = stmt.run(item_id);
    return res.changes > 0;
  }

  // Inventory-related methods will be moved here if/when implemented
}
