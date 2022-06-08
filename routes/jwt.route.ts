import * as express from 'express'
import { isStatusValid, StatusCodes } from '../shared/statuscodes'
import { 
    getAllUsers, 
    registerNewUser, 
    signIn,
    validateJwt
} from '../services/jwt.service'
import { getResponse } from '../shared/response-parser'

export const router = express.Router()

router.get('/', (req, res) => {
    res.json(getResponse({ msg: 'JWT homepage' }))
})

router.post('/register', async (req, res) => {
    const { email, password, role } = req.body

    // Input data validation
    if (!email || !password || (!role && role != 0)) {
        res.status(400).json(
            getResponse(
                null, 
                StatusCodes.INVALID_DATA_FORMAT
            )
        )
        return
    }

    // Register the new user
    const { status, data, httpCode } = await registerNewUser(email, password, role)
    if (!isStatusValid(status)) {
        res.status(httpCode).json(
            getResponse(
                null, 
                status
            )
        )
        return
    }

    res.status(201).json(getResponse({ user: data }))
})

router.post('/sign_in', async (req, res) => {
    const { email, password } = req.body

    // Input data validation
    if (!email || !password) {
        res.status(400).json(
            getResponse(
                null, 
                StatusCodes.INVALID_DATA_FORMAT
            )
        )
        return
    }

    const { status, token, httpCode } = await signIn(email, password)
    if (!isStatusValid(status)) {
        res.status(httpCode).json(
            getResponse(
                null,
                status
            )
        )
        return
    }

    res.json(getResponse({ token }))
})

router.get('/users', (req, res) => {
    res.json(getResponse({ users: getAllUsers() }))
})

router.get('/protected', validateJwt, (req, res, next) => {
    res.json(getResponse({ msg: 'This is a protected data' }))
})
