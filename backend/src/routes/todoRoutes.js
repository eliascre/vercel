const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todoController')

// Health check
router.get('/health', todoController.getHealth)

// GET all todos
router.get('/todos', todoController.getTodos)

// GET single todo
router.get('/todos/:id', todoController.getTodo)

// POST create todo
router.post('/todos', todoController.createTodo)

// PUT update todo
router.put('/todos/:id', todoController.updateTodo)

// DELETE todo
router.delete('/todos/:id', todoController.deleteTodo)

// DELETE all completed
router.delete('/todos', todoController.clearCompleted)

module.exports = router
