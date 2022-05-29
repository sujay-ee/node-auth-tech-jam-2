import { StatusCodes } from '../shared/statuscodes'
import { JwtStore } from '../datastore/jwt.store'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

// Global constants
const JWT_SECRET_KEY = "my_secret_key"
const JWT_TTL = 300 // Jwt time-to-live

// Init the jwt auth datastore
const datastore = new JwtStore()

// Datastore exports
export const getAllUsers = () => datastore.getAllUsers()

async function isPasswordValid(passString: String, passEncrypted: String) {
    return await bcrypt.compare(passString, passEncrypted)
}

export async function registerNewUser(email: String, password: String, role: number) {

    // Check if user already exists
    if (datastore.findUserByEmail(email)) {
        return {
            status: StatusCodes.EMAIL_ALREADY_EXISTS,
            data: null
        }
    }

    // Remove the oldest users when user limit is reached
    if (datastore.isUserListFull())
        datastore.removeOldestUser()
    
    // Add new jwt user
    const hashSalt = 10
    const hashedPassword = await bcrypt.hash(password, hashSalt)
    return {
        status: StatusCodes.SUCCESS,
        data: datastore.addUser(email, hashedPassword, role)
    }
}

export async function signIn(email: String, password: String) {

    // Ensure the user exists
    const user = datastore.findUserByEmail(email)
    if (!user) {
        return { 
            status: StatusCodes.USER_NOT_REGISTERED,  
            token: null
        }
    }

    // Password check
    const isValid = await isPasswordValid(password, user.password)
    if (!isValid) {
        // TODO this is a 401
        return {
            status: StatusCodes.RESOURCE_ACCESS_DENIED,
            token: null
        }
    }

    // Generate the jwt token
    const jwtHeader = { algorithm: "HS256", expiresIn: JWT_TTL }
    const token = jwt.sign({ email, role: user.role }, JWT_SECRET_KEY, jwtHeader)
    return { 
        status: StatusCodes.SUCCESS,  
        token
    }

}

export function validateJwt(req, res, next) {
    // TODO paste the jwt token format here
    const jwtToken = req.headers.authorization.split(' ')[1]

    // Token doesn't exist
    if (!jwtToken) {
        res.status(400).json({
            status: StatusCodes.TOKEN_EMPTY
        })
        return
    }

    // Validate the jwt token
    // TODO clean this up
    try {
        const jwtData = jwt.verify(jwtToken, JWT_SECRET_KEY)
        console.log(`this is debug: ${JSON.stringify(jwtData)}`)
        if (!jwtData) {
            res.status(401).json({
                status: StatusCodes.TOKEN_BAD
            })
            return
        }
    } catch (e) {
        console.log(`err: ${e}`)
        res.status(401).json({
            status: StatusCodes.TOKEN_BAD
        })
        return
    }

    next()
}
