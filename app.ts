const express = require('express')

const port = 3000
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.json({"data": "Hello World, this is a public resource"})
})

app.listen(port, () => {
    console.log(`App running at port ${port}`)
})
