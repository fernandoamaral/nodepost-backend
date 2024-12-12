import mongoose from 'mongoose'
import app from './server.js'

const port = process.env.PORT || 3000

try {
  console.log('Connecting to MongoDB')
  await mongoose.connect("mongodb+srv://fernando:cQ7aZEvzOCI56pmk@cluster0.jnmrp.mongodb.net/posts?retryWrites=true&w=majority&appName=Cluster0")
  console.log('Connected to MongoDB')

  app.listen(port, () => {
    console.log(`Running in http://localhost:${port}`)
  })
} catch (error) {
  console.error(error)
}
