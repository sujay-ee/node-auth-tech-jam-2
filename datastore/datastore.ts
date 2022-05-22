import { apiKeyUsers, basicAuthUsers } from '../shared/data'

let users = []

export enum UserType {
    API_KEY, 
    BASIC_AUTH, 
    OAUTH
}

export function setUserType(userType: UserType) {
    switch(+userType) {
        case UserType.API_KEY:
            users = [...apiKeyUsers]
            break
        case UserType.BASIC_AUTH:
            users = [...basicAuthUsers]
            break
        case UserType.OAUTH:
            break
    }
}

export function getRandomUserId() {
    return Date.now().toString(36)
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

export function addUser(user) {
    users.push(user)
    return user
}

export function removeOldestUser() {
    // .shift() removes the leftmost item
    users.shift()
}