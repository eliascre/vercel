let todos = [
  { id: '1', title: 'Configurer Vercel', completed: true, priority: 'high', createdAt: new Date().toISOString() },
  { id: '2', title: 'Déployer le frontend React', completed: false, priority: 'high', createdAt: new Date().toISOString() },
  { id: '3', title: 'Connecter le backend Express', completed: false, priority: 'medium', createdAt: new Date().toISOString() },
  { id: '4', title: 'Ajouter Dependabot', completed: true, priority: 'low', createdAt: new Date().toISOString() },
]

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

exports.getTodos = (_req, res) => {
  res.json({
    success: true,
    count: todos.length,
    data: todos,
  })
}

exports.getTodo = (req, res) => {
  const todo = todos.find(t => t.id === req.params.id)
  if (!todo) {
    return res.status(404).json({ success: false, message: 'Tâche introuvable' })
  }
  res.json({ success: true, data: todo })
}

exports.createTodo = (req, res) => {
  const { title, priority = 'medium' } = req.body
  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, message: 'Le titre est requis' })
  }
  const newTodo = {
    id: generateId(),
    title: title.trim(),
    completed: false,
    priority,
    createdAt: new Date().toISOString(),
  }
  todos.unshift(newTodo)
  res.status(201).json({ success: true, data: newTodo })
}

exports.updateTodo = (req, res) => {
  const index = todos.findIndex(t => t.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Tâche introuvable' })
  }
  todos[index] = {
    ...todos[index],
    ...req.body,
    id: todos[index].id,
    createdAt: todos[index].createdAt,
    updatedAt: new Date().toISOString(),
  }
  res.json({ success: true, data: todos[index] })
}

exports.deleteTodo = (req, res) => {
  const index = todos.findIndex(t => t.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Tâche introuvable' })
  }
  todos.splice(index, 1)
  res.json({ success: true, message: 'Tâche supprimée' })
}

exports.clearCompleted = (_req, res) => {
  todos = todos.filter(t => !t.completed)
  res.json({ success: true, message: 'Tâches terminées supprimées', count: todos.length })
}

exports.getHealth = (_req, res) => {
  res.json({
    status: 'ok',
    message: '✅ API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    todos: todos.length,
  })
}
