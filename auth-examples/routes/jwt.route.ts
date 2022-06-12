import * as express from "express"
import { isStatusValid } from "../shared/statuscodes"
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
    /**
     * TODO
     *
     * - To register a user we need two fields "email" and "password"
     * - Both "email" and "password" can be obtained from the request body
     * - Fields should not be missing or empty
     * - Registered users "email" must be unique
     * - Return the details of the registered user
     */
})

router.post("/signin", async (req, res) => {
    /**
     * TODO
     *
     * - To signin a user we need "email" and "password"
     * - Both "email" and "password" can be obtained from the request body
     * - Fields should not be missing or empty
     * - Fails when email-password combination is bad
     * - "email" should already be registered
     * - When successful generate a jwt token
     * - Return the token on successful signin
     *
     * Hints:
     * - To generate a jwt token either use "generateJwtToken(email)" from "jwt.service.ts"
     *   Or use "jsonwebtoken" module and use "jwt.sign({email})"
     */
})

router.get("/users", (req, res) => {
    res.json(getResponse({ users: getAllUsers() }))
})

router.get("/protected", validateJwt, (req, res) => {
    /**
     * TODO
     *
     * - To validate the request we need the jwt token in the headers
     * - Fails if the jwt token isn't available or empty
     * - Fails if the jwt token isn't valid
     * - Return a 200 on successful request
     *
     * Hints:
     * - Get the authorization token from the headers using "req.headers.authorization"
     * - Authorization is sent in the header with format "Bearer <token>"
     */
})
