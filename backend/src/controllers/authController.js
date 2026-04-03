const db = require('../bdd/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_secure'

// ===== Inscription =====
exports.signup = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe requis' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' })
          }
          return res.status(500).json({ success: false, message: 'Erreur lors de l’inscription' })
        }
        res.status(201).json({ success: true, message: 'Compte créé avec succès !' })
      }
    )
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
}

// ===== Connexion =====
exports.login = (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe requis' })
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' })
    }

    // Génération du Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: { id: user.id, email: user.email }
    })
  })
}
