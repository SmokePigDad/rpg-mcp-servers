// Database migration script
const { GameDatabase } = require('./game-state-server/dist/db.js');

console.log('🔄 Running database migrations...');

try {
  const db = new GameDatabase();
  console.log('✅ Database initialized');

  // Check current schema
  const schema = db.db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='characters'").get();
  console.log('Current schema:', schema.sql);

  // Test that the experience column now exists
  try {
    const testQuery = db.db.prepare('SELECT experience FROM characters LIMIT 1');
    console.log('✅ Experience column is now available');
  } catch (error) {
    console.log('❌ Experience column still missing:', error.message);
  }

} catch (error) {
  console.error('❌ Migration failed:', error.message);
}
