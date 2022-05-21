import { v4 as uuidv4, validate } from 'uuid';
import { 
    getNumUsers, 
    findUser, 
    addUser, 
    removeOldestUser, 
    getNumUsagesToday
} from '../datastore/api-key-store'

const MAX_NUM_REGISTERED_USERS = 10
const MAX_REQUESTS_PER_DAY = 10

function getNewApiKey() {
    return uuidv4()
}

function registerNewUser(email: String, host: String) {

    // Remove the oldest users when user limit is reached
    if (getNumUsers() >= MAX_NUM_REGISTERED_USERS)
        removeOldestUser()
    
    // Add new user to registered users
    addUser(getNewApiKey(), email, host)
}

export function isKeyValid(apiKey: String, host: String) {

    // Key is not a valid uuid
    if (!validate(apiKey))
        return false
    
    // Ensure that the user exists
    const user = findUser(apiKey, host)
    if (!user)
        return false
    
    // Ensure that the user hasn't already made too many requests
    if (getNumUsagesToday() >= MAX_REQUESTS_PER_DAY)
        return false
    
    // Valid api key
    return true
}
