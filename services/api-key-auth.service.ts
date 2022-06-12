import { v4 as uuidv4, validate } from "uuid"
import { ApiKeyStore } from "../datastore/api-key.store"
import { StatusCodes } from "../shared/statuscodes"
import { getResponse } from "../shared/response-parser"
import { MAX_API_REQUESTS_PER_DAY } from "../shared/configs"

// Init api key datastore
const datastore = new ApiKeyStore()

// Datastore exports
export const getAllUsers = () => datastore.getAllUsers()
export function incrementNumUsagesToday(
    apiKey: String,
    host: String
) {
    return datastore.incrementNumUsagesToday(apiKey, host)
}

function getNewApiKey() {
    return uuidv4()
}

function isKeyValid(apiKey: String, host: String) {
    // Key is not a valid uuid
    if (!validate(apiKey)) return false

    // Ensure that the user exists
    const user = datastore.findUser(apiKey, host)
    if (!user) return false

    // Valid api key
    return true
}

function hasAccess(apiKey: String, host: String) {
    const numUsages = datastore.getNumUsagesToday(
        apiKey,
        host
    )

    // Api hasn't been queried yet
    if (!numUsages) return true

    // Ensure that the user hasn't already made too many requests
    if (numUsages >= MAX_API_REQUESTS_PER_DAY) return false

    return true
}

export function registerNewUser(
    email: String,
    host: String
) {
    // Check if the user already exists
    const user = datastore.findUserByEmail(email)
    if (user) {
        return {
            status: StatusCodes.EMAIL_ALREADY_EXISTS,
            user: null,
            httpCode: 409,
        }
    }

    // Remove the oldest users when user limit is reached
    if (datastore.isUserListFull())
        datastore.removeOldestUser()

    // Add new user to registered users
    return {
        status: StatusCodes.SUCCESS,
        user: datastore.addUser(
            getNewApiKey(),
            email,
            host
        ),
        httpCode: 201,
    }
}

export function validateKey(req, res, next) {
    const host = req.headers.host
    const apiKey = req.header("x-api-key")

    // Check if input data is valid
    // Control shouldn't reach here when apikey is empty
    if (!host || !apiKey) {
        res.status(400).json(
            getResponse(null, StatusCodes.API_KEY_EMPTY)
        )
        return
    }

    // Invalidate the api key
    if (!isKeyValid(apiKey, host)) {
        res.status(401).json(
            getResponse(
                null,
                StatusCodes.RESOURCE_ACCESS_DENIED
            )
        )
        return
    }

    // Invalidate max queries
    if (!hasAccess(apiKey, host)) {
        res.status(429).json(
            getResponse(
                null,
                StatusCodes.API_LIMIT_EXCEEDED
            )
        )
        return
    }

    next()
}
