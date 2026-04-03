const StatCard = ({ label, value, colorClass }) => (
  <div className="stat-card">
    <span className="stat-label">{label}</span>
    <span className={`stat-value ${colorClass}`}>{value}</span>
  </div>
)

export default StatCard
