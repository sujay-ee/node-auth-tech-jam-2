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
     * TODO
     *
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
})

router.get("/users", (req, res) => {
    const ret = { users: getAllUsers() }
    res.json(getResponse(ret))
})

router.get("/protected", (req, res) => {
    /**
     * TODO
     *
     * - This is a protected route. It requires the api key to be successful
     * - Obtain fields "host" and "x-api-key" from header
     * - Fields should not be missing or empty
     * - Fails when api key is invalid i.e api-key and "host" combination is bad
     * - (Optional) Fails when the "/protected" route has been queried more than the daily limit
     */
})
