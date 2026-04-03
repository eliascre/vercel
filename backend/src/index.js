require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

// ===== Middleware =====
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
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

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: '✅ API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// Hello World
app.get('/api/hello', (_req, res) => {
  res.json({
    message: '👋 Hello from the Node.js backend!',
    stack: {
      frontend: 'React + Vite',
      backend: 'Node.js + Express',
    },
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    message: '🔍 Route not found',
  })
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('❌ Error:', err.message)
  res.status(500).json({
    status: 'error',
    message: '💥 Internal server error',
  })
})

// ===== Start Server =====
app.listen(PORT, () => {
  console.log('')
  console.log('🚀 Server is running!')
  console.log(`🌐 URL:         http://localhost:${PORT}`)
  console.log(`💚 Health:      http://localhost:${PORT}/api/health`)
  console.log(`👋 Hello:       http://localhost:${PORT}/api/hello`)
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log('')
})

module.exports = app
