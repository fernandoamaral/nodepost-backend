import 'dotenv/config'
import express from 'express'
import routes from './routes.js'
import fs from 'fs'
import swaggerUi from 'swagger-ui-express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})
app.use(routes)

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'))
const swaggerOptions = {
  swaggerOptions: { tryItOutEnabled: true }
}
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions))

app.use((error, req, res, next) => {
  const status = error.statusCode || 500
  res.status(status).json({ message: error.message })
})

export default app
