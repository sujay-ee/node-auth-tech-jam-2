import * as express from "express"
import {
    getAllUsers,
    registerNewUser,
    validateKey,
    incrementNumUsagesToday,
} from "../services/api-key-auth.service"
import {
    isStatusValid,
    StatusCodes,
} from "../shared/statuscodes"
import { getResponse } from "../shared/response-parser"

export const router = express.Router()

router.get("/", (req, res) => {
    const ret = { msg: "Api key homepage" }
    res.json(getResponse(ret, StatusCodes.SUCCESS))
})

router.post("/register", (req, res) => {
    const host = req.headers.host
    const email = req.body.email

    // Check if input data is valid
    if (!email || !host) {
        res.status(400).json(
            getResponse(
                null,
                StatusCodes.INVALID_DATA_FORMAT
            )
        )
        return
    }

    // Register the new user
    const { status, user, httpCode } = registerNewUser(
        email,
        host
    )
    res.status(httpCode).json(getResponse(user, status))
})

router.get("/users", (req, res) => {
    const ret = { users: getAllUsers() }
    res.json(getResponse(ret))
})

router.get("/protected", validateKey, (req, res) => {
    const host = req.headers.host
    const apiKey = req.header("x-api-key")

    const status = incrementNumUsagesToday(apiKey, host)
    if (!isStatusValid(status)) {
        // Control shouldn't reach here,
        // This means that a request was able to get past
        // the api-key validation using a bad api-key
        res.status(401).json(getResponse(null, status))
        return
    }

    const ret = { msg: "This is protected data" }
    res.json(getResponse(ret))
})
