import { ApiKeyStore } from '../datastore/api-key.store'
import { v4 as uuidv4, validate } from 'uuid'

// Max protected api query limit per day
const MAX_REQUESTS_PER_DAY = 10

// Init api key datastore
const datastore = new ApiKeyStore()

// Datastore exports
export const getAllUsers = () => datastore.getAllUsers()
export const findUserByEmail = (email) => datastore.findUserByEmail(email)
export function incrementNumUsagesToday(apiKey: String, host: String) {
    return datastore.incrementNumUsagesToday(apiKey, host)
}

function getNewApiKey() {
    return uuidv4()
}

function isKeyValid(apiKey: String, host: String) {

    // Key is not a valid uuid
    if (!validate(apiKey))
        return false
    
    // Ensure that the user exists
    const user = datastore.findUser(apiKey, host)
    if (!user)
        return false
    
    // Valid api key
    return true
}

function hasAccess(apiKey: String, host: String) {

    const numUsages = datastore.getNumUsagesToday(apiKey, host)

    // Api hasn't been queried yet
    if (!numUsages)
        return true

    // Ensure that the user hasn't already made too many requests
    if (numUsages >= MAX_REQUESTS_PER_DAY)
        return false
    
    return true
}

export function registerNewUser(email: String, host: String) {

    // Remove the oldest users when user limit is reached
    if (datastore.isUserListFull())
        datastore.removeOldestUser()
    
    // Add new user to registered users
    return datastore.addUser(getNewApiKey(), email, host)
}

export function validateKey(req, res, next) {
    const host = req.headers.origin
    const apiKey = req.header('x-api-key')

    // Invalidate the api key
    if (!isKeyValid(apiKey, host)) {
        res.status(401).send('You are not allowed to access this resource')
        return
    }
    
    // Invalidate max queries
    if (!hasAccess(apiKey, host)) {
        res.status(429).send('API limit exceeded')
        return
    }
    
    next()
}
