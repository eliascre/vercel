import { useState } from 'react'
import axios from 'axios'
import translations from '../utils/translations'

const Login = ({ lang, onLogin, onSwitchToSignup, onGuestMode }) => {
  const t = translations[lang]
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      onLogin(res.data.token, res.data.user)
    } catch (err) {
      setError(err.response?.data?.message || t.error_auth)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>{t.login}</h2>
        <p>{t.welcome_back}</p>
      </div>

      {error && <div className="error-bar">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>{t.email}</label>
          <input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>{t.password}</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary auth-btn" disabled={loading}>
          {loading ? t.loading : t.submit_login}
        </button>
      </form>

      <div style={{ margin: '15px 0', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
        <button className="btn-secondary auth-btn" onClick={onGuestMode} style={{ background: 'rgba(255,255,255,0.03)' }}>
          🚀 {t.continue_guest}
        </button>
      </div>

      <p className="auth-footer">
        {t.no_account}{' '}
        <button className="link-btn" onClick={onSwitchToSignup}>
          {t.signup}
        </button>
      </p>
    </div>
  )
}

export default Login
