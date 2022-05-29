import * as express from 'express'
import { 
    findUserByEmail, 
    getAllUsers, 
    registerNewUser, 
    validateKey, 
    incrementNumUsagesToday 
} from '../services/api-key-auth.service'
import { StatusCodes } from '../shared/statuscodes'

export const router = express.Router()

router.get('/', (req, res) => {
    res.json({
        data: { msg: "Api key homepage" },
        status: StatusCodes.SUCCESS
    })
})

router.post('/register', (req, res) => {
    const email = req.body.email
    const host = req.body.origin

    // Check if input data is valid
    if (!email || !host) {
        res.status(400).json({ 
            status: StatusCodes.INVALID_DATA_FORMAT 
        })
        return
    }

    // Check if the user already exists
    if (findUserByEmail(email)) {
        res.status(400).json({ 
            status: StatusCodes.EMAIL_ALREADY_EXISTS 
        })
        return
    }

    // Register the new user
    const user = registerNewUser(email, host)
    res.status(201).json({ 
        data: user, 
        status: StatusCodes.SUCCESS 
    })
})

router.get('/users', (req, res) => {
    res.json({ 
        data: { users: getAllUsers() }, 
        status: StatusCodes.SUCCESS 
    })
})

router.get('/protected', validateKey, (req, res) => {
    const host = req.headers.origin
    const apiKey = req.header('x-api-key')

    // Check if input data is valid
    if (!host || !apiKey) {
        res.status(400).json({ 
            status: StatusCodes.EMAIL_ALREADY_EXISTS 
        })
        return
    }

    const ret = incrementNumUsagesToday(apiKey, host)
    if (!ret) {
        // Control shouldn't reach here,
        // This means that a request was able to get past 
        // the api-key validation using a bad api-key
        res.status(404).json({
            status: StatusCodes.USER_NOT_REGISTERED
        })
        return
    }

    res.json({
        data: { msg: "This is protected data" },
        status: StatusCodes.SUCCESS
    })
})
