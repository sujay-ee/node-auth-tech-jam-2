import * as express from "express"
import { getResponse } from "../shared/response-parser"
import {
    getAllUsers,
    validateUser,
    registerNewUser,
} from "../services/basic-auth.service"
import { StatusCodes } from "../shared/statuscodes"

export const router = express.Router()

router.get("/", (req, res) => {
    const ret = { msg: "Basic auth homepage" }
    res.json(getResponse(ret))
})

router.post("/register", async (req, res) => {
    const { email, password } = req.body

    // Ensure the input data is valid
    if (!email || !password) {
        res.status(400).json(
            getResponse(
                null,
                StatusCodes.INVALID_DATA_FORMAT
            )
        )
        return
    }

    // Register a new user
    const { status, data, httpCode } =
        await registerNewUser(email, password)
    // Don't send the encrypted password back to client
    const ret =
        data == null
            ? null
            : { id: data["id"], email: data["email"] }
    res.status(httpCode).json(getResponse(ret, status))
})

router.get("/users", (req, res) => {
    res.json(getResponse({ users: getAllUsers() }))
})

router.get("/protected", validateUser, (req, res) => {
    res.json(getResponse({ msg: "This is protected data" }))
})
