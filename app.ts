import express from "express"
import { router as apiKeyRouter } from "./routes/api-key.route"
import { router as basicAuthRouter } from "./routes/basic-auth.route"
import { router as jwtRouter } from "./routes/jwt.route"

export function createServer() {
    const app = express()

    // Middlewares
    app.use(express.json())

    // Routes
    app.use("/apikey", apiKeyRouter)
    app.use("/basicauth", basicAuthRouter)
    app.use("/jwt", jwtRouter)

    // Public route
    app.get("/", (req, res) => {
        res.send("Hello World, this is a public resource")
    })

    return app
}

// Start listening to requests
const app = createServer()
if (process.env.NODE_ENV !== "test") {
    app.listen(3000, () => {
        console.log(`App running at port 3000`)
    })
}
