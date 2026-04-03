import { useState, useEffect } from 'react'
import axios from 'axios'

const STACK = [
  { icon: '⚛️', name: 'React 18', desc: 'Frontend framework' },
  { icon: '⚡', name: 'Vite', desc: 'Build tool ultra-rapide' },
  { icon: '🟢', name: 'Node.js', desc: 'Runtime JavaScript' },
  { icon: '🚂', name: 'Express', desc: 'API REST backend' },
]

function App() {
  const [apiData, setApiData] = useState(null)
  const [apiStatus, setApiStatus] = useState('loading')

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await axios.get('/api/hello')
        setApiData(JSON.stringify(res.data, null, 2))
        setApiStatus('success')
      } catch {
        setApiData('Backend non connecté — lancez le serveur avec: cd backend && npm run dev')
        setApiStatus('error')
      }
    }
    fetchApi()
  }, [])

  return (
    <div className="app">
      {/* Background Orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">🚀</div>
          <span className="logo-text">FullStack App</span>
        </div>
        <div className="header-badge">
          <span className="status-dot" aria-hidden="true" />
          React + Node.js
        </div>
      </header>

      {/* Hero */}
      <main className="hero">
        <div className="hero-tag">✨ Projet Fullstack Moderne</div>

        <h1>
          Bienvenue sur votre<br />
          <span className="gradient-text">application fullstack</span>
        </h1>

        <p className="hero-subtitle">
          Un frontend React rapide, un backend Node.js robuste, et une architecture
          prête pour la production sur Vercel.
        </p>

        <div className="hero-actions">
          <a
            id="btn-docs"
            className="btn btn-primary"
            href="https://github.com/eliascre/vercel"
            target="_blank"
            rel="noopener noreferrer"
          >
            📂 Voir le code source
          </a>
          <button
            id="btn-refresh"
            className="btn btn-secondary"
            onClick={() => { setApiStatus('loading'); setApiData(null); setTimeout(() => {
              axios.get('/api/hello')
                .then(r => { setApiData(JSON.stringify(r.data, null, 2)); setApiStatus('success') })
                .catch(() => { setApiData('Backend non connecté'); setApiStatus('error') })
            }, 400) }}
          >
            🔄 Rafraîchir l'API
          </button>
        </div>

        {/* API Response Card */}
        <div className="api-card" aria-live="polite">
          <div className="api-card-header">
            <span className="api-card-title">GET /api/hello</span>
            <span className={`api-badge ${apiStatus}`}>
              {apiStatus === 'loading' ? '⏳ Chargement' : apiStatus === 'success' ? '✅ Connecté' : '❌ Erreur'}
            </span>
          </div>
          <div className="api-response">
            {apiStatus === 'loading' ? (
              <div className="api-loading">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            ) : (
              <pre style={{ whiteSpace: 'pre-wrap' }}>{apiData}</pre>
            )}
          </div>
        </div>
      </main>

      {/* Tech Stack */}
      <section className="stack-grid" aria-label="Technologies utilisées">
        {STACK.map((item) => (
          <div key={item.name} className="stack-card">
            <span className="stack-icon" aria-hidden="true">{item.icon}</span>
            <div className="stack-name">{item.name}</div>
            <div className="stack-desc">{item.desc}</div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Propulsé par <span>React</span> + <span>Node.js</span> · Déployé sur <span>Vercel</span></p>
      </footer>
    </div>
  )
}

export default App
