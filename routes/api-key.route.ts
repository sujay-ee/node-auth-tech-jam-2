import * as express from 'express'
import { 
    getAllUsers, 
    registerNewUser, 
    validateKey, 
    incrementNumUsagesToday 
} from '../services/api-key-auth.service'
import { isValid, StatusCodes } from '../shared/statuscodes'

export const router = express.Router()

router.get('/', (req, res) => {
    res.json({
        data: { msg: "Api key homepage" },
        status: StatusCodes.SUCCESS
    })
})

router.post('/register', (req, res) => {
    const host = req.headers.host
    const email = req.body.email

    // Check if input data is valid
    if (!email || !host) {
        res.status(400).json({ 
            status: StatusCodes.INVALID_DATA_FORMAT,
            data: null
        })
        return
    }

    // Register the new user
    const { status, user } = registerNewUser(email, host)
    if (!isValid(status)) {
        // TODO All invalidations assumed to be bad-request 
        res.status(400).json({ 
            status: StatusCodes.EMAIL_ALREADY_EXISTS,
            data: null
        })
        return
    }

    // New user created
    res.status(201).json({ 
        status: StatusCodes.SUCCESS,
        data: user
    })
})

router.get('/users', (req, res) => {
    res.json({ 
        status: StatusCodes.SUCCESS,
        data: { users: getAllUsers() }
    })
})

router.get('/protected', validateKey, (req, res) => {
    const host = req.headers.host
    const apiKey = req.header('x-api-key')

    // Check if input data is valid
    // Control shouldn't reach here when apikey is empty
    if (!host || !apiKey) {
        res.status(400).json({ 
            status: StatusCodes.API_KEY_EMPTY,
            data: null
        })
        return
    }

    const ret = incrementNumUsagesToday(apiKey, host)
    if (!isValid(ret)) {
        // Control shouldn't reach here,
        // This means that a request was able to get past 
        // the api-key validation using a bad api-key
        res.status(404).json({
            status: ret,
            data: null
        })
        return
    }

    res.json({
        status: StatusCodes.SUCCESS,
        data: { msg: "This is protected data" }
    })
})
