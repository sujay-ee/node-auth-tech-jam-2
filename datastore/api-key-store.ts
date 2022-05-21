import { apiKeyUsers as users } from '../shared/data';

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

export function addUser(apiKey: String, email: String, host: String) {
    users.push(createNewUser(apiKey, email, host))
}

export function removeOldestUser() {
    // .shift() removes the leftmost item
    users.shift()
}

export function getNumUsagesToday() {
    const dateToday = getDateToday()
    return users.find((user) => user.usages.find((u) => u.date === dateToday))
}
