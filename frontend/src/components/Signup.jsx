import { useState } from 'react'
import axios from 'axios'

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas')
    }
    setLoading(true)
    setError('')
    try {
      await axios.post('/api/auth/signup', { email, password })
      onSignupSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Créer un compte</h2>
        <p>Commencez dès maintenant !</p>
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
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label>Confirmer le mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="btn-primary auth-btn" disabled={loading}>
          {loading ? 'Chargement...' : 'S’inscrire'}
        </button>
      </form>

      <p className="auth-footer">
        Déjà un compte ?{' '}
        <button className="link-btn" onClick={onSwitchToLogin}>
          Se connecter
        </button>
      </p>
    </div>
  )
}

export default Signup
