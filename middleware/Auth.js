import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticated.' })
  }
  const token = req.get('Authorization').split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'batman')

  if (!decodedToken) {
    return res.status(401).json({ message: 'Not authenticated.' })
  }

  req.userId = decodedToken.userId
  next()
}
