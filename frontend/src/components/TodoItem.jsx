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
  formatDate,
  t
}) => (
  <li id={`todo-${todo.id}`} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
    {/* Checkbox */}
    <button
      className={`todo-check ${todo.completed ? 'checked' : ''}`}
      onClick={() => onToggle(todo)}
      aria-label={todo.completed ? t.completed : t.active}
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
        />
      ) : (
        <div className="todo-title">{todo.title}</div>
      )}
      <div className="todo-meta">
        <span className={`priority-badge priority-${todo.priority}`}>
          {t[`priority_${todo.priority}`]}
        </span>
        <span className="todo-date">{formatDate(todo.createdAt)}</span>
      </div>
    </div>

    {/* Actions */}
    <div className="todo-actions">
      {editId === todo.id ? (
        <>
          <button className="btn-icon save" onClick={() => onSave(todo.id)}>✓</button>
          <button className="btn-icon" onClick={() => setEditId(null)}>✕</button>
        </>
      ) : (
        <>
          <button className="btn-icon" onClick={() => onEdit(todo)}>✏️</button>
          <button className="btn-icon danger" onClick={() => onDelete(todo.id)}>🗑</button>
        </>
      )}
    </div>
  </li>
)

export default TodoItem
