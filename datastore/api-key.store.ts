import { apiKeyUsers as users } from '../shared/data'

function getRandomUserId() {
    return Date.now().toString(36)
}

function getDateToday() {
    return new Date().toISOString().split('T')[0]
}

function createNewUser(apiKey: String, email: String, host: String) {
    return {
        id: getRandomUserId(),
        api_key: apiKey,
        email: email,
        host: host,
        usages: [{ date: getDateToday(), count: 0 }]
    }
}

export function getAllUsers() {
    return users
}

export function getNumUsers() {
    return users.length
}

export function findUser(apiKey: String, host: String) {
    return users.find((u) => u.api_key === apiKey && u.host === host)
}

export function findUserByEmail(email: String) {
    return users.find((u) => u.email === email)
}

export function addUser(apiKey: String, email: String, host: String) {
    const user = createNewUser(apiKey, email, host)
    users.push(user)

    return user
}

export function removeOldestUser() {
    // .shift() removes the leftmost item
    users.shift()
}

export function getNumUsagesToday() {
    const dateToday = getDateToday()
    return users.find((user) => user.usages.find((u) => u.date === dateToday))
}

export function incrementNumUsagesToday(apiKey: String, host: String) {
    const dateToday = getDateToday()
    const user = findUser(apiKey, host)

    // User not found
    if (!user)
        return

    // First entry of the day
    const usageIndex = user.usages.findIndex((u) => u.date === dateToday)
    if (usageIndex == -1) {
        user.usages.push({ date: dateToday, count: 1 })
        return
    }

    // Update the existing usage entry
    return ++ user.usages[usageIndex].count
}
