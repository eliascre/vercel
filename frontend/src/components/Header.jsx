import translations from '../utils/translations'

const Header = ({ lang, setLang, user, isGuest, onLogout }) => {
  const t = translations[lang]

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">📋</div>
        <span className="logo-text">{t.title}</span>
      </div>

      <div className="header-right">
        {/* Lang Toggle */}
        <div className="lang-toggle">
          <button 
            className={`lang-btn ${lang === 'fr' ? 'active' : ''}`} 
            onClick={() => setLang('fr')}
          >
            FR
          </button>
          <button 
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`} 
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>

        {/* User Status */}
        {(user || isGuest) && (
          <div className="user-info">
            <span className="user-email">
              {isGuest ? `👤 ${t.guest_mode}` : `📧 ${user?.email}`}
            </span>
            <button className="btn-secondary logout-btn" onClick={onLogout}>
              {t.logout}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
