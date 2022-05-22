import express from 'express'
import { router as apiKeyRouter } from './routes/api-key.route'
import { router as basicAuthRouter } from './routes/basic-auth.route'

const app = express()

// Apply middlewares
app.use(express.json())

// Routes
app.use('/apikey', apiKeyRouter)
app.use('/basicauth', basicAuthRouter)

// Public route
app.get('/', (req, res) => {
    res.send("Hello World, this is a public resource")
})

// Start listening to requests
app.listen(3000, () => {
    console.log(`App running at port 3000`)
})
