require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

// ===== Middleware =====
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ===== Request Logger =====
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.path}`)
  next()
})

// ===== In-Memory Store =====
let todos = [
  { id: '1', title: 'Configurer Vercel', completed: true, priority: 'high', createdAt: new Date().toISOString() },
  { id: '2', title: 'Déployer le frontend React', completed: false, priority: 'high', createdAt: new Date().toISOString() },
  { id: '3', title: 'Connecter le backend Express', completed: false, priority: 'medium', createdAt: new Date().toISOString() },
  { id: '4', title: 'Ajouter Dependabot', completed: true, priority: 'low', createdAt: new Date().toISOString() },
]

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

// ===== Routes =====

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: '✅ API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    todos: todos.length,
  })
})

// GET all todos
app.get('/api/todos', (_req, res) => {
  res.json({
    success: true,
    count: todos.length,
    data: todos,
  })
})

// GET single todo
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id)
  if (!todo) {
    return res.status(404).json({ success: false, message: 'Tâche introuvable' })
  }
  res.json({ success: true, data: todo })
})

// POST create todo
app.post('/api/todos', (req, res) => {
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
})

// PUT update todo
app.put('/api/todos/:id', (req, res) => {
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
})

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Tâche introuvable' })
  }
  todos.splice(index, 1)
  res.json({ success: true, message: 'Tâche supprimée' })
})

// DELETE all completed
app.delete('/api/todos', (_req, res) => {
  todos = todos.filter(t => !t.completed)
  res.json({ success: true, message: 'Tâches terminées supprimées', count: todos.length })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: '🔍 Route not found' })
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('❌ Error:', err.message)
  res.status(500).json({ success: false, message: '💥 Internal server error' })
})

// ===== Start Server =====
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running → http://localhost:${PORT}`)
    console.log(`📋 Todos API  → http://localhost:${PORT}/api/todos`)
    console.log(`💚 Health     → http://localhost:${PORT}/api/health\n`)
  })
}

module.exports = app
