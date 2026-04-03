const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todoController')
const authMiddleware = require('../middleware/authMiddleware')

// Health check (Open)
router.get('/health', todoController.getHealth)

// CRUD Tâches (Protégé par JWT)
router.get('/todos', authMiddleware, todoController.getTodos)
router.post('/todos', authMiddleware, todoController.createTodo)
router.put('/todos/:id', authMiddleware, todoController.updateTodo)
router.delete('/todos/:id', authMiddleware, todoController.deleteTodo)
router.delete('/todos', authMiddleware, todoController.clearCompleted)

module.exports = router
