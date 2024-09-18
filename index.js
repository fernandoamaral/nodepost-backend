import mongoose from 'mongoose'
import app from './server.js'

const port = process.env.PORT || 3000

try {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  app.listen(port, () => {
    console.log(`Running in http://localhost:${port}`)
  })
} catch (error) {
  console.error(error)
}
