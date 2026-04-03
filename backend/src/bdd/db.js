const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

// Ensure the bdd directory exists
const bddPath = path.join(__dirname)
if (!fs.existsSync(bddPath)) {
  fs.mkdirSync(bddPath, { recursive: true })
}

const dbFile = path.join(bddPath, 'database.sqlite')

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('❌ Erreur lors de l’ouverture de SQLite :', err.message)
  } else {
    console.log('✅ SQLite connecté (bdd/database.sqlite)')
  }
})

// Initialize tables
db.serialize(() => {
  // Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Todos Table (linked to userId)
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      priority TEXT DEFAULT 'medium',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      userId INTEGER,
      FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    )
  `)
})

module.exports = db
