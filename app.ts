import express from 'express'

const app = express()

// Apply middlewares
app.use(express.json())

// Apply routes
// app.use(express.json())

// Public route
app.get('/', (req, res) => {
    res.send("Hello World, this is a public resource")
})

// Protected route
app.get('/protected', (req, res) => {
    res.send("This is a supposed to be a protected route")
})

// Start listening to requests
app.listen(3000, () => {
    console.log(`App running at port 3000`)
})
