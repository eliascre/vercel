import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Header from './components/Header'
import StatCard from './components/StatCard'
import TodoItem from './components/TodoItem'
import TodoForm from './components/TodoForm'
import Login from './components/Login'
import Signup from './components/Signup'
import translations from './utils/translations'

const FILTERS = ['all', 'active', 'completed']
const PRIORITIES = ['high', 'medium', 'low']

export default function App() {
  // --- Lang State ---
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr')
  const t = translations[lang]

  // --- Auth State ---
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const [isGuest, setIsGuest] = useState(localStorage.getItem('isGuest') === 'true')
  const [authView, setAuthView] = useState('login')

  // --- Data State ---
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [submitting, setSubmitting] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editValue, setEditValue] = useState('')

  // Configure axios
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // --- Helpers ---
  const saveGuestTodos = (newTodos) => {
    localStorage.setItem('guest_todos', JSON.stringify(newTodos))
    setTodos(newTodos)
  }

  const syncGuestTodos = async (newToken) => {
    const localTodos = JSON.parse(localStorage.getItem('guest_todos') || '[]')
    if (localTodos.length === 0) return

    console.log(t.sync_message)
    try {
      for (const todo of localTodos) {
        await axios.post('/api/todos', { 
          title: todo.title, 
          priority: todo.priority 
        }, { headers: { Authorization: `Bearer ${newToken}` } })
      }
      localStorage.removeItem('guest_todos')
    } catch (err) {
      console.error('Sync failed', err)
    }
  }

  // --- Auth Actions ---
  const handleLogin = async (newToken, newUser) => {
    // Sync if guest had data
    if (isGuest) {
      await syncGuestTodos(newToken)
      setIsGuest(false)
      localStorage.removeItem('isGuest')
    }
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('isGuest')
    localStorage.removeItem('guest_todos')
    setToken('')
    setUser(null)
    setIsGuest(false)
    setTodos([])
    setAuthView('login')
  }

  const handleGuestMode = () => {
    setIsGuest(true)
    localStorage.setItem('isGuest', 'true')
    const localTodos = JSON.parse(localStorage.getItem('guest_todos') || '[]')
    setTodos(localTodos)
  }

  const changeLang = (newLang) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  // --- Data Actions ---
  const fetchTodos = useCallback(async () => {
    if (isGuest) {
      const localTodos = JSON.parse(localStorage.getItem('guest_todos') || '[]')
      setTodos(localTodos)
      return
    }
    if (!token) return

    setLoading(true)
    try {
      const res = await axios.get('/api/todos')
      setTodos(res.data.data)
      setError('')
    } catch (err) {
      if (err.response?.status === 401) handleLogout()
      else setError(t.error_auth)
    } finally {
      setLoading(false)
    }
  }, [token, isGuest, t.error_auth])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newTitle.trim() || submitting) return
    
    if (isGuest) {
      const newTodo = {
        id: Date.now().toString(),
        title: newTitle.trim(),
        completed: false,
        priority: newPriority,
        createdAt: new Date().toISOString()
      }
      saveGuestTodos([newTodo, ...todos])
      setNewTitle('')
      return
    }

    setSubmitting(true)
    try {
      const res = await axios.post('/api/todos', { title: newTitle.trim(), priority: newPriority })
      setTodos(prev => [res.data.data, ...prev])
      setNewTitle('')
    } catch {
      setError(t.error_add)
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (todo) => {
    const updated = todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
    if (isGuest) {
      saveGuestTodos(updated)
      return
    }
    setTodos(updated)
    try {
      await axios.put(`/api/todos/${todo.id}`, { completed: !todo.completed })
    } catch {
      fetchTodos()
    }
  }

  const handleDelete = async (id) => {
    if (isGuest) {
      saveGuestTodos(todos.filter(t => t.id !== id))
      return
    }
    setTodos(prev => prev.filter(t => t.id !== id))
    try {
      await axios.delete(`/api/todos/${id}`)
    } catch {
      fetchTodos()
    }
  }

  const clearCompletedGuest = () => {
    saveGuestTodos(todos.filter(t => !t.completed))
  }

  // --- Auth View ---
  if (!token && !isGuest) {
    return (
      <div className="app">
        <div className="bg-orbs"><div className="orb orb-1" /><div className="orb orb-2" /></div>
        <Header lang={lang} setLang={changeLang} />
        <div className="auth-container">
          {authView === 'login' ? (
            <Login 
              lang={lang} 
              onLogin={handleLogin} 
              onSwitchToSignup={() => setAuthView('signup')} 
              onGuestMode={handleGuestMode}
            />
          ) : (
            <Signup 
              lang={lang} 
              onSignupSuccess={() => setAuthView('login')} 
              onSwitchToLogin={() => setAuthView('login')} 
            />
          )}
        </div>
      </div>
    )
  }

  // Statistics
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
      
      <Header 
        lang={lang} 
        setLang={changeLang} 
        user={user} 
        isGuest={isGuest} 
        onLogout={handleLogout} 
      />

      <main className="main">
        <div className="stats-row">
          <StatCard label={t.total} value={total} colorClass="purple" />
          <StatCard label={t.active} value={activeCount} colorClass="cyan" />
          <StatCard label={t.completed} value={completedCount} colorClass="green" />
        </div>

        <div className="progress-wrap">
          <div className="progress-header"><span>{t.progress}</span><span>{progress}%</span></div>
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
          t={t}
        />

        <div className="filters">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {t[`filter_${f}`]}
              {` (${f === 'all' ? total : f === 'active' ? activeCount : completedCount})`}
            </button>
          ))}
          {completedCount > 0 && (
            <button className="btn-clear filter-right" onClick={isGuest ? clearCompletedGuest : () => axios.delete('/api/todos').then(fetchTodos)}>
              🗑 {t.delete_all}
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">✨</span>
            {t.empty_state}
          </div>
        ) : (
          <ul className="todos-list">
            {filtered.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={(todo) => {setEditId(todo.id); setEditValue(todo.title)}}
                editId={editId}
                editValue={editValue}
                setEditValue={setEditValue}
                onSave={async (id) => {
                  if (isGuest) {
                    saveGuestTodos(todos.map(t => t.id === id ? { ...t, title: editValue } : t))
                    setEditId(null)
                  } else {
                    await axios.put(`/api/todos/${id}`, { title: editValue })
                    setTodos(prev => prev.map(t => t.id === id ? { ...t, title: editValue } : t))
                    setEditId(null)
                  }
                }}
                setEditId={setEditId}
                formatDate={(iso) => new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                t={t}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
