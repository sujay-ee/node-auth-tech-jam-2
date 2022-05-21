import express from 'express'
import { router as apiKeyRouter } from './routes/api-key-service'

const app = express()

// Apply middlewares
app.use(express.json())

// Routes
app.use('/apikey', apiKeyRouter)

// Public route
app.get('/', (req, res) => {
    res.send("Hello World, this is a public resource")
})

// Start listening to requests
app.listen(3000, () => {
    console.log(`App running at port 3000`)
})
