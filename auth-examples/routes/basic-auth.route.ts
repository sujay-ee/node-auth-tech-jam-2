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
    /**
     * TODO
     *
     * - To register a user we need 2 fields "email" and "password"
     * - Both "email" and "password" can be obtained from the request body
     * - Fields should not be missing or empty
     * - Registered users "email" must be unique
     * - Return the details of the registered user
     */
})

router.get("/users", (req, res) => {
    res.json(getResponse({ users: getAllUsers() }))
})

router.get("/protected", (req, res) => {
    /**
     * TODO
     *
     * - This is a protected route. It requires a authorization to be successful
     * - Obtain the authorization token from the headers
     * - Parse the authorization token to decode the email and password
     * - Fields should not be missing or empty
     * - "email" should already be registered
     * - email-password combination should be valid
     *
     * Hint:
     * - Get the authorization token from the headers using "req.headers.authorization"
     * - Authorization is sent in the header with format,
     *   "Basic <base64 encrypted email:password>"
     */
})
