import { StatusCodes } from "../shared/statuscodes"
import { JwtStore } from "../datastore/jwt.store"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { getResponse } from "../shared/response-parser"
import { JWT_SECRET_KEY, JWT_TTL } from "../shared/configs"

// Init the jwt auth datastore
const datastore = new JwtStore()

// Datastore exports
export const getAllUsers = () => datastore.getAllUsers()

async function isPasswordValid(
    passString: String,
    passEncrypted: String
) {
    return await bcrypt.compare(passString, passEncrypted)
}

function getJwtToken(email: String) {
    // Generate the jwt token
    const jwtHeader = {
        algorithm: "HS256",
        expiresIn: JWT_TTL,
    }
    return jwt.sign({ email }, JWT_SECRET_KEY, jwtHeader)
}

export async function registerNewUser(
    email: String,
    password: String
) {
    // Input data validation
    if (!email || !password) {
        return {
            status: StatusCodes.INVALID_DATA_FORMAT,
            token: null,
            httpCode: 400,
        }
    }

    // Check if user already exists
    if (datastore.findUserByEmail(email)) {
        return {
            status: StatusCodes.EMAIL_ALREADY_EXISTS,
            data: null,
            httpCode: 409,
        }
    }

    // Remove the oldest users when user limit is reached
    if (datastore.isUserListFull())
        datastore.removeOldestUser()

    // Add new jwt user
    const hashSalt = 10
    const hashedPassword = await bcrypt.hash(
        password,
        hashSalt
    )
    return {
        status: StatusCodes.SUCCESS,
        data: datastore.addUser(email, hashedPassword),
        httpCode: 201,
    }
}

export async function signIn(
    email: String,
    password: String
) {
    // Input data validation
    if (!email || !password) {
        return {
            status: StatusCodes.INVALID_DATA_FORMAT,
            token: null,
            httpCode: 400,
        }
    }

    // Ensure the user exists
    const user = datastore.findUserByEmail(email)
    if (!user) {
        return {
            status: StatusCodes.USER_NOT_REGISTERED,
            token: null,
            httpCode: 400,
        }
    }

    // Password check
    const isStatusValid = await isPasswordValid(
        password,
        user.password
    )
    if (!isStatusValid) {
        return {
            status: StatusCodes.RESOURCE_ACCESS_DENIED,
            token: null,
            httpCode: 401,
        }
    }

    return {
        status: StatusCodes.SUCCESS,
        token: getJwtToken(email),
        httpCode: 200,
    }
}

export function validateJwt(req, res, next) {
    var jwtToken = req.headers.authorization

    // Token doesn't exist
    if (!jwtToken) {
        res.status(400).json(
            getResponse(null, StatusCodes.TOKEN_EMPTY)
        )
        return
    }
    jwtToken = jwtToken.split(" ")[1]

    // Validate the jwt token
    try {
        const jwtData = jwt.verify(jwtToken, JWT_SECRET_KEY)
        if (!jwtData) {
            res.status(401).json(
                getResponse(null, StatusCodes.TOKEN_BAD)
            )
            return
        }
    } catch (e) {
        console.log(`err: ${e}`)
        res.status(401).json(
            getResponse(null, StatusCodes.TOKEN_BAD)
        )
        return
    }

    next()
}
