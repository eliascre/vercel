const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_secure'

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: '🔒 Accès refusé. Token manquant.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Ajout des infos utilisateur à la requête
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: '🔒 Session expirée ou Token invalide.' })
  }
}
