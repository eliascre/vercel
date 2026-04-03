import { useState } from 'react'
import axios from 'axios'
import translations from '../utils/translations'

const Signup = ({ lang, onSignupSuccess, onSwitchToLogin }) => {
  const t = translations[lang]
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setError(lang === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match')
    }
    setLoading(true)
    setError('')
    try {
      await axios.post('/api/auth/signup', { email, password })
      onSignupSuccess()
    } catch (err) {
      setError(err.response?.data?.message || t.error_add)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>{t.signup}</h2>
        <p>{t.start_now}</p>
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
        <div className="form-group">
          <label>{t.confirm_password}</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary auth-btn" disabled={loading}>
          {loading ? t.loading : t.submit_signup}
        </button>
      </form>

      <p className="auth-footer">
        {t.have_account}{' '}
        <button className="link-btn" onClick={onSwitchToLogin}>
          {t.login}
        </button>
      </p>
    </div>
  )
}

export default Signup
