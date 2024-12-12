import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class AuthController {
  static async signup (req, res) {
    try {
      const exists = await User.findOne({ email: req.body.email })

      if (exists) {
        return res.status(422).json({ message: 'E-mail address already exists!' })
      }

      if(!req.body.password || req.body.password.lengh < 4){
        return res.status(422).json({ message: 'The password must be greater than 4 chars.' })
      }

      const password = await bcrypt.hash(req.body.password, 10)
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password
      })

      res.status(201).json({ message: 'User created!', userId: user._id })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async login (req, res) {
    try {
      const user = await User.findOne({ email: req.body.email })
      if (!user) {
        return res.status(401).json({ message: 'Wrong credentials.' })
      }

      const isEqual = await bcrypt.compare(req.body.password, user.password)
      if (!isEqual) {
        return res.status(401).json({ message: 'Wrong credentials.' })
      }

      const token = jwt.sign(
        { name: user.name, userId: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      )

      res.status(200).json({ token, userId: user._id.toString() })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default AuthController
