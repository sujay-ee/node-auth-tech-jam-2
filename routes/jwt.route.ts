import * as express from "express"
import {
    isStatusValid,
    StatusCodes,
} from "../shared/statuscodes"
import {
    getAllUsers,
    registerNewUser,
    signIn,
    validateJwt,
} from "../services/jwt.service"
import { getResponse } from "../shared/response-parser"

export const router = express.Router()

router.get("/", (req, res) => {
    res.json(getResponse({ msg: "JWT homepage" }))
})

router.post("/register", async (req, res) => {
    const { email, password } = req.body

    // Register the new user
    const { status, data, httpCode } =
        await registerNewUser(email, password)
    if (!isStatusValid(status)) {
        res.status(httpCode).json(getResponse(null, status))
        return
    }

    res.status(201).json(getResponse({ user: data }))
})

router.post("/signin", async (req, res) => {
    const { email, password } = req.body

    const { status, token, httpCode } = await signIn(
        email,
        password
    )
    if (!isStatusValid(status)) {
        res.status(httpCode).json(getResponse(null, status))
        return
    }

    res.json(getResponse({ token }))
})

router.get("/users", (req, res) => {
    res.json(getResponse({ users: getAllUsers() }))
})

router.get("/protected", validateJwt, (req, res, next) => {
    res.json(
        getResponse({ msg: "This is a protected data" })
    )
})
