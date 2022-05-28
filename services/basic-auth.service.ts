import { BasicAuthStore } from '../datastore/basic-auth.store'
import * as bcrypt from 'bcrypt'

// Init the basic auth datastore
const datastore = new BasicAuthStore()

// Datastore exports
export const getAllUsers = () => datastore.getAllUsers()

async function isPasswordValid(passString: String, passEncrypted: String) {
    return await bcrypt.compare(passString, passEncrypted)
}

export async function validateUser(req, res, next) {
    const email = req.body.email
    const user = datastore.findUserByEmail(email)

    // User doesn't exist
    // Status code could be 404
    if (!user) {
        res.status(401).send('Invalid credentials')
        return
    }

    // Make sure the password is correct
    const password = req.body.password
    const isValid = await isPasswordValid(password, user.password)
    if (!isValid) {
        res.status(401).send('You are not allowed to access this resource')
        return
    }

    next()
}

export async function registerNewUser(email: String, password: String) {

    // Remove the oldest users when user limit is reached
    if (datastore.isUserListFull())
        datastore.removeOldestUser()

    // Add new user to registered users
    const hashSalt = 10
    const hashedPassword = await bcrypt.hash(password, hashSalt)
    return datastore.addUser(email, hashedPassword)
}
