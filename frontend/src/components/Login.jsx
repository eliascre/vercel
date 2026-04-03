import { useState } from 'react'
import axios from 'axios'

const Login = ({ onLogin, onSwitchToSignup }) => {
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
      setError(err.response?.data?.message || 'Erreur lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Connexion</h2>
        <p>Bon retour parmi nous !</p>
      </div>

      {error && <div className="error-bar">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn-primary auth-btn" disabled={loading}>
          {loading ? 'Chargement...' : 'Se connecter'}
        </button>
      </form>

      <p className="auth-footer">
        Vous n'avez pas de compte ?{' '}
        <button className="link-btn" onClick={onSwitchToSignup}>
          S'inscrire
        </button>
      </p>
    </div>
  )
}

export default Login
