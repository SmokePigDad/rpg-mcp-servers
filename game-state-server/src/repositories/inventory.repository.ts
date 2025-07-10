import Database from 'better-sqlite3';

export class InventoryRepository {
  private db: Database.Database;
  constructor(db: Database.Database) {
    this.db = db;
  }

  // Inventory-related methods will be moved here if/when implemented
}
