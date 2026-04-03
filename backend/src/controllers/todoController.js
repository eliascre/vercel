const db = require('../bdd/db')

// GET all todos for a specific user
exports.getTodos = (req, res) => {
  const userId = req.user.id
  db.all('SELECT * FROM todos WHERE userId = ? ORDER BY createdAt DESC', [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des tâches' })
    }
    res.json({ success: true, count: rows.length, data: rows })
  })
}

// POST create todo
exports.createTodo = (req, res) => {
  const { title, priority = 'medium' } = req.body
  const userId = req.user.id

  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, message: 'Le titre est requis' })
  }

  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
  const createdAt = new Date().toISOString()

  db.run(
    'INSERT INTO todos (id, title, completed, priority, createdAt, userId) VALUES (?, ?, ?, ?, ?, ?)',
    [id, title.trim(), 0, priority, createdAt, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur lors de la création de la tâche' })
      }
      res.status(201).json({
        success: true,
        data: { id, title: title.trim(), completed: false, priority, createdAt, userId }
      })
    }
  )
}

// PUT update todo
exports.updateTodo = (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const updates = req.body

  // On construit dynamiquement la requête de mise à jour
  const fields = []
  const values = []

  if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title) }
  if (updates.completed !== undefined) { fields.push('completed = ?'); values.push(updates.completed ? 1 : 0) }
  if (updates.priority !== undefined) { fields.push('priority = ?'); values.push(updates.priority) }

  if (fields.length === 0) {
    return res.status(400).json({ success: false, message: 'Aucune donnée à mettre à jour' })
  }

  values.push(id, userId)

  db.run(
    `UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND userId = ?`,
    values,
    function (err) {
      if (err || this.changes === 0) {
        return res.status(404).json({ success: false, message: 'Tâche introuvable ou accès refusé' })
      }
      res.json({ success: true, message: 'Tâche mise à jour' })
    }
  )
}

// DELETE todo
exports.deleteTodo = (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  db.run('DELETE FROM todos WHERE id = ? AND userId = ?', [id, userId], function (err) {
    if (err || this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Tâche introuvable' })
    }
    res.json({ success: true, message: 'Tâche supprimée' })
  })
}

// DELETE all completed
exports.clearCompleted = (req, res) => {
  const userId = req.user.id
  db.run('DELETE FROM todos WHERE userId = ? AND completed = 1', [userId], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erreur lors de la suppression' })
    }
    res.json({ success: true, message: 'Tâches terminées supprimées' })
  })
}

// Health check
exports.getHealth = (_req, res) => {
  res.json({
    status: 'ok',
    message: '✅ API is running with SQLite'
  })
}
