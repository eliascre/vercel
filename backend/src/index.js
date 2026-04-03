require('dotenv').config()
const express = require('express')
const cors = require('cors')
const todoRoutes = require('./routes/todoRoutes')

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

// ===== Routes =====
app.use('/', todoRoutes)

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
