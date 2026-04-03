const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  editId,
  editValue,
  setEditValue,
  onSave,
  setEditId,
  formatDate
}) => (
  <li id={`todo-${todo.id}`} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
    {/* Checkbox */}
    <button
      className={`todo-check ${todo.completed ? 'checked' : ''}`}
      onClick={() => onToggle(todo)}
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
            if (e.key === 'Enter') onSave(todo.id)
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
          <button id={`save-${todo.id}`} className="btn-icon save" onClick={() => onSave(todo.id)} title="Sauvegarder">✓</button>
          <button id={`cancel-${todo.id}`} className="btn-icon" onClick={() => setEditId(null)} title="Annuler">✕</button>
        </>
      ) : (
        <>
          <button id={`edit-${todo.id}`} className="btn-icon" onClick={() => onEdit(todo)} title="Modifier">✏️</button>
          <button id={`delete-${todo.id}`} className="btn-icon danger" onClick={() => onDelete(todo.id)} title="Supprimer">🗑</button>
        </>
      )}
    </div>
  </li>
)

export default TodoItem
