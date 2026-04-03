const TodoForm = ({
  onSubmit,
  newTitle,
  setNewTitle,
  newPriority,
  setNewPriority,
  submitting,
  priorities
}) => (
  <form className="add-form" onSubmit={onSubmit} aria-label="Ajouter une tâche">
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
      {priorities.map(p => (
        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
      ))}
    </select>
    <button id="btn-add" className="btn-add" type="submit" disabled={!newTitle.trim() || submitting}>
      {submitting ? '...' : '+ Ajouter'}
    </button>
  </form>
)

export default TodoForm
