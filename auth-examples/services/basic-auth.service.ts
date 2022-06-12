import { BasicAuthStore } from "../datastore/basic-auth.store"
import { StatusCodes } from "../shared/statuscodes"
import * as bcrypt from "bcrypt"
import { getResponse } from "../shared/response-parser"

// Init the basic auth datastore
const datastore = new BasicAuthStore()

// Datastore exports
export const getAllUsers = () => datastore.getAllUsers()

async function isPasswordValid(
    passString: String,
    passEncrypted: String
) {
    return await bcrypt.compare(passString, passEncrypted)
}

export async function validateUser(req, res, next) {
    const email = req.body.email
    const password = req.body.password
    const user = datastore.findUserByEmail(email)

    // Empty email or password
    if (!email || !password) {
        res.status(400).json(
            getResponse(
                null,
                StatusCodes.INVALID_DATA_FORMAT
            )
        )
        return
    }

    // User doesn't exist
    if (email && !user) {
        res.status(400).json(
            getResponse(
                null,
                StatusCodes.USER_NOT_REGISTERED
            )
        )
        return
    }

    // Make sure the password is correct
    const isStatusValid = await isPasswordValid(
        password,
        user.password
    )
    if (!isStatusValid) {
        res.status(401).json(
            getResponse(
                null,
                StatusCodes.RESOURCE_ACCESS_DENIED
            )
        )
        return
    }

    next()
}

export async function registerNewUser(
    email: String,
    password: String
) {
    // Check if the user already exists
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

    // Add new user to registered users
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
