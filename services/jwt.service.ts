import { JwtStore } from '../datastore/jwt.store'

// Global constants
const JWT_SECRET_KEY = "my_secret_key"
const JWT_TTL = 300 // Jwt time-to-live

const jwt = require("jsonwebtoken")
// Init the jwt auth datastore
const datastore = new JwtStore()

// Datastore exports
export const getAllUsers = () => datastore.getAllUsers()

export function registerNewUser(email: String, password: String, role: number) {

    // Remove the oldest users when user limit is reached
    if (datastore.isUserListFull())
        datastore.removeOldestUser()
    
    // Add new jwt user
    return datastore.addUser(email, password, role)
}

export function signIn(email: String, password: String) {
    const jwtHeader = {
        algorithm: "HS256",
        expiresIn: JWT_TTL,
    }
    const token = jwt.sign({ email }, JWT_SECRET_KEY, jwtHeader)
    return token
}
