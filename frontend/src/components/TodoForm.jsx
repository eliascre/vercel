const TodoForm = ({
  onSubmit,
  newTitle,
  setNewTitle,
  newPriority,
  setNewPriority,
  submitting,
  priorities,
  t
}) => (
  <form className="add-form" onSubmit={onSubmit} aria-label={t.add_placeholder}>
    <input
      id="new-todo-input"
      className="add-input"
      type="text"
      placeholder={t.add_placeholder}
      value={newTitle}
      onChange={e => setNewTitle(e.target.value)}
      aria-label={t.title}
    />
    <select
      id="priority-select"
      className="priority-select"
      value={newPriority}
      onChange={e => setNewPriority(e.target.value)}
      aria-label="Priorité"
    >
      {priorities.map(p => (
        <option key={p} value={p}>{t[`priority_${p}`]}</option>
      ))}
    </select>
    <button id="btn-add" className="btn-add" type="submit" disabled={!newTitle.trim() || submitting}>
      {submitting ? '...' : `+ ${lang === 'fr' ? 'Ajouter' : 'Add'}`}
    </button>
  </form>
)

export default TodoForm
