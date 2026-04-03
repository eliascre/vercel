import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import StatCard from './components/StatCard'
import TodoItem from './components/TodoItem'
import TodoForm from './components/TodoForm'
import Login from './components/Login'
import Signup from './components/Signup'

const FILTERS = ['all', 'active', 'completed']
const PRIORITIES = ['high', 'medium', 'low']

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })

export default function App() {
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const [authView, setAuthView] = useState('login') // 'login' or 'signup'

  // App state
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [submitting, setSubmitting] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editValue, setEditValue] = useState('')

  // Configure axios with token
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // ===== Actions Auth =====
  const handleLogin = (newToken, newUser) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken('')
    setUser(null)
    setTodos([])
    setAuthView('login')
  }

  // ===== Fetch todos =====
  const fetchTodos = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await axios.get('/api/todos')
      setTodos(res.data.data)
      setError('')
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout()
      } else {
        setError('❌ Erreur de connexion au serveur')
      }
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchTodos()
  }, [token, fetchTodos])

  // ===== Add todo =====
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newTitle.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await axios.post('/api/todos', { title: newTitle.trim(), priority: newPriority })
      setTodos(prev => [res.data.data, ...prev])
      setNewTitle('')
    } catch {
      setError('❌ Impossible d\'ajouter la tâche')
    } finally {
      setSubmitting(false)
    }
  }

  // ===== Toggle completed =====
  const handleToggle = async (todo) => {
    const optimistic = todos.map(t =>
      t.id === todo.id ? { ...t, completed: !t.completed } : t
    )
    setTodos(optimistic)
    try {
      await axios.put(`/api/todos/${todo.id}`, { completed: !todo.completed })
    } catch {
      setTodos(todos)
    }
  }

  // ===== Delete todo =====
  const handleDelete = async (id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
    try {
      await axios.delete(`/api/todos/${id}`)
    } catch {
      fetchTodos()
    }
  }

  // ===== Edit todo =====
  const startEdit = (todo) => { setEditId(todo.id); setEditValue(todo.title) }
  const saveEdit = async (id) => {
    if (!editValue.trim()) return
    try {
      await axios.put(`/api/todos/${id}`, { title: editValue.trim() })
      setTodos(prev => prev.map(t => t.id === id ? { ...t, title: editValue.trim() } : t))
    } finally {
      setEditId(null)
    }
  }

  // ===== Clear completed =====
  const clearCompleted = async () => {
    try {
      await axios.delete('/api/todos')
      setTodos(prev => prev.filter(t => !t.completed))
    } catch {
      setError('❌ Impossible de supprimer')
    }
  }

  // ===== Render Logic =====
  if (!token) {
    return (
      <div className="app">
        <div className="bg-orbs"><div className="orb orb-1" /><div className="orb orb-2" /></div>
        <header className="header">
          <div className="logo"><div className="logo-icon">📋</div><span className="logo-text">TodoApp</span></div>
        </header>
        <div className="auth-container">
          {authView === 'login' ? (
            <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />
          ) : (
            <Signup onSignupSuccess={() => setAuthView('login')} onSwitchToLogin={() => setAuthView('login')} />
          )}
        </div>
      </div>
    )
  }

  // Stats
  const total = todos.length
  const completedCount = todos.filter(t => t.completed).length
  const activeCount = total - completedCount
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0
  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  return (
    <div className="app">
      <div className="bg-orbs"><div className="orb orb-1" /><div className="orb orb-2" /></div>
      
      <header className="header">
        <div className="logo"><div className="logo-icon">📋</div><span className="logo-text">TodoApp</span></div>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button className="btn-secondary" onClick={handleLogout} style={{ padding: '6px 12px' }}>Déconnexion</button>
        </div>
      </header>

      <main className="main">
        <div className="stats-row">
          <StatCard label="Total" value={total} colorClass="purple" />
          <StatCard label="En cours" value={activeCount} colorClass="cyan" />
          <StatCard label="Terminées" value={completedCount} colorClass="green" />
        </div>

        <div className="progress-wrap">
          <div className="progress-header"><span>Progression</span><span>{progress}%</span></div>
          <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
        </div>

        {error && <div className="error-bar">{error}</div>}

        <TodoForm
          onSubmit={handleAdd}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newPriority={newPriority}
          setNewPriority={setNewPriority}
          submitting={submitting}
          priorities={PRIORITIES}
        />

        <div className="filters">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Toutes' : f === 'active' ? 'En cours' : 'Terminées'}
              {` (${f === 'all' ? total : f === 'active' ? activeCount : completedCount})`}
            </button>
          ))}
          {completedCount > 0 && <button className="btn-clear filter-right" onClick={clearCompleted}>🗑 Supprimer</button>}
        </div>

        {loading ? (
          <div className="loading-dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">✨</span>
            Ajoutez votre première tâche ! (Liste vide au démarrage)
          </div>
        ) : (
          <ul className="todos-list">
            {filtered.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={startEdit}
                editId={editId}
                editValue={editValue}
                setEditValue={setEditValue}
                onSave={saveEdit}
                setEditId={setEditId}
                formatDate={formatDate}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
