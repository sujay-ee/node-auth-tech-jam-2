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
    /**
     * - To register a user we need 2 fields "email" and "host"
     * - "email" to be obtained from the body and "host" is available in the headers
     * - Fields should not be missing or empty
     * - Registered users "email" must be unique
     * - Return the details of the registered user along with the api key on successful register
     *
     * Hint:
     * - Field "host" can be obtained by quering "req.headers.host"
     * - To generate an api key use function "getNewApiKey()" availale at "api-key-auth.service.ts"
     *   Or use "uuidv4" from "uuid"
     */
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
    /**
     * - This is a protected route. It requires the api key to be successful
     * - Obtain fields "host" and "x-api-key" from header
     * - Fields should not be missing or empty
     * - Fails when api key is invalid i.e api-key and "host" combination is bad
     * - (Optional) Fails when the "/protected" route has been queried more than the daily limit
     */
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
