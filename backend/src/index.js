require('dotenv').config()
const express = require('express')
const cors = require('cors')
const todoRoutes = require('./routes/todoRoutes')
const authRoutes = require('./routes/authRoutes')

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

// Logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ===== Routes =====
app.use('/api/auth', authRoutes)
app.use('/api', todoRoutes)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: '🔍 Route not found' })
})

// Error handler
app.use((err, _req, res, _next) => {
  console.error('❌ Error Server:', err.message)
  res.status(500).json({ success: false, message: '💥 Internal server error' })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 API Auth & Todos active sur http://localhost:${PORT}`)
  })
}

module.exports = app
