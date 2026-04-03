import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API = '/api'
const FILTERS = ['all', 'active', 'completed']
const PRIORITIES = ['high', 'medium', 'low']

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })

export default function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [submitting, setSubmitting] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [apiOnline, setApiOnline] = useState(false)

  // ===== Fetch todos =====
  const fetchTodos = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/todos`)
      setTodos(res.data.data)
      setApiOnline(true)
      setError('')
    } catch {
      setError('❌ Backend non connecté. Lancez : cd backend && npm run dev')
      setApiOnline(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTodos() }, [fetchTodos])

  // ===== Add todo =====
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newTitle.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await axios.post(`${API}/todos`, { title: newTitle.trim(), priority: newPriority })
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
      await axios.put(`${API}/todos/${todo.id}`, { completed: !todo.completed })
    } catch {
      setTodos(todos) // revert
    }
  }

  // ===== Delete todo =====
  const handleDelete = async (id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
    try {
      await axios.delete(`${API}/todos/${id}`)
    } catch {
      await fetchTodos() // revert on error
    }
  }

  // ===== Edit todo =====
  const startEdit = (todo) => { setEditId(todo.id); setEditValue(todo.title) }

  const saveEdit = async (id) => {
    if (!editValue.trim()) return
    try {
      const res = await axios.put(`${API}/todos/${id}`, { title: editValue.trim() })
      setTodos(prev => prev.map(t => t.id === id ? res.data.data : t))
    } catch {
      setError('❌ Impossible de modifier la tâche')
    } finally {
      setEditId(null)
    }
  }

  // ===== Clear completed =====
  const clearCompleted = async () => {
    try {
      await axios.delete(`${API}/todos`)
      setTodos(prev => prev.filter(t => !t.completed))
    } catch {
      setError('❌ Impossible de supprimer les tâches terminées')
    }
  }

  // ===== Stats =====
  const total = todos.length
  const completed = todos.filter(t => t.completed).length
  const active = total - completed
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  // ===== Filtered list =====
  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  return (
    <div className="app">
      {/* Background */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">📋</div>
          <span className="logo-text">TodoApp</span>
        </div>
        <div className="header-right">
          <div className="status-badge">
            <span className="status-dot" style={{ background: apiOnline ? 'var(--success)' : 'var(--error)' }} />
            {apiOnline ? 'API connectée' : 'API hors ligne'}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main">

        {/* Stats */}
        <div className="stats-row" role="region" aria-label="Statistiques">
          <div className="stat-card">
            <span className="stat-label">Total</span>
            <span className="stat-value purple">{total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">En cours</span>
            <span className="stat-value cyan">{active}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Terminées</span>
            <span className="stat-value green">{completed}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-wrap" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-header">
            <span>Progression</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Error */}
        {error && <div className="error-bar" role="alert">{error}</div>}

        {/* Add form */}
        <form className="add-form" onSubmit={handleAdd} aria-label="Ajouter une tâche">
          <input
            id="new-todo-input"
            className="add-input"
            type="text"
            placeholder="Nouvelle tâche..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            aria-label="Titre de la tâche"
          />
          <select
            id="priority-select"
            className="priority-select"
            value={newPriority}
            onChange={e => setNewPriority(e.target.value)}
            aria-label="Priorité"
          >
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
          <button id="btn-add" className="btn-add" type="submit" disabled={!newTitle.trim() || submitting}>
            {submitting ? '...' : '+ Ajouter'}
          </button>
        </form>

        {/* Filters */}
        <div className="filters" role="tablist" aria-label="Filtres">
          {FILTERS.map(f => (
            <button
              key={f}
              id={`filter-${f}`}
              role="tab"
              aria-selected={filter === f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Toutes' : f === 'active' ? 'En cours' : 'Terminées'}
              {f === 'all' && ` (${total})`}
              {f === 'active' && ` (${active})`}
              {f === 'completed' && ` (${completed})`}
            </button>
          ))}
          {completed > 0 && (
            <button id="btn-clear-completed" className="btn-clear filter-right" onClick={clearCompleted}>
              🗑 Supprimer terminées
            </button>
          )}
        </div>

        {/* Todo list */}
        {loading ? (
          <div className="loading-dots" aria-label="Chargement">
            <div className="dot" /><div className="dot" /><div className="dot" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" aria-live="polite">
            <span className="empty-icon">
              {filter === 'completed' ? '🎉' : filter === 'active' ? '✨' : '📋'}
            </span>
            {filter === 'completed' ? 'Aucune tâche terminée' :
             filter === 'active' ? 'Aucune tâche en cours' :
             'Ajoutez votre première tâche !'}
          </div>
        ) : (
          <ul className="todos-list" aria-label="Liste des tâches">
            {filtered.map(todo => (
              <li
                key={todo.id}
                id={`todo-${todo.id}`}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                {/* Checkbox */}
                <button
                  className={`todo-check ${todo.completed ? 'checked' : ''}`}
                  onClick={() => handleToggle(todo)}
                  aria-label={todo.completed ? 'Marquer comme non terminé' : 'Marquer comme terminé'}
                />

                {/* Content */}
                <div className="todo-content">
                  {editId === todo.id ? (
                    <input
                      className="todo-edit-input"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit(todo.id)
                        if (e.key === 'Escape') setEditId(null)
                      }}
                      autoFocus
                      aria-label="Modifier la tâche"
                    />
                  ) : (
                    <div className="todo-title">{todo.title}</div>
                  )}
                  <div className="todo-meta">
                    <span className={`priority-badge priority-${todo.priority}`}>{todo.priority}</span>
                    <span className="todo-date">{formatDate(todo.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="todo-actions">
                  {editId === todo.id ? (
                    <>
                      <button id={`save-${todo.id}`} className="btn-icon save" onClick={() => saveEdit(todo.id)} title="Sauvegarder">✓</button>
                      <button id={`cancel-${todo.id}`} className="btn-icon" onClick={() => setEditId(null)} title="Annuler">✕</button>
                    </>
                  ) : (
                    <>
                      <button id={`edit-${todo.id}`} className="btn-icon" onClick={() => startEdit(todo)} title="Modifier">✏️</button>
                      <button id={`delete-${todo.id}`} className="btn-icon danger" onClick={() => handleDelete(todo.id)} title="Supprimer">🗑</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Propulsé par <span>React</span> + <span>Node.js</span> · Déployé sur <span>Vercel</span></p>
      </footer>
    </div>
  )
}
