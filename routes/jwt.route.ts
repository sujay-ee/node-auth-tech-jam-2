import * as express from 'express'
import { isValid, StatusCodes } from '../shared/statuscodes'
import { 
    getAllUsers, 
    registerNewUser, 
    signIn,
    validateJwt
} from '../services/jwt.service'

export const router = express.Router()

router.get('/', (req, res) => {
    res.json({
        data: { msg: "JWT homepage" },
        status: StatusCodes.SUCCESS
    })
})

router.post('/register', async (req, res) => {
    const { email, password, role } = req.body

    // Input data validation
    if (!email || !password || (!role && role != 0)) {
        res.status(400).json({ 
            status: StatusCodes.INVALID_DATA_FORMAT,
            data: null
        })
        return
    }

    // Register the new user
    const { status, data } = await registerNewUser(email, password, role)
    if (!isValid(status)) {
        res.status(400).json({
            status: status,
            data: null
        })
        return
    }

    res.status(201).json({ 
        data: { user: data },
        status: StatusCodes.SUCCESS
    })
})

router.post('/sign_in', async (req, res) => {
    const { email, password } = req.body

    // Input data validation
    if (!email || !password) {
        res.status(400).json({ 
            status: StatusCodes.INVALID_DATA_FORMAT 
        })
        return
    }

    const { status, token } = await signIn(email, password)
    if (!isValid(status)) {
        res.status(400).json({
            status: status,
            data: null
        })
        return
    }

    res.json({
        status: StatusCodes.SUCCESS,
        data: { token }
    })
})

router.get('/users', (req, res) => {
    res.json({ 
        status: StatusCodes.SUCCESS,
        data: { users: getAllUsers() }
     })
})

router.get('/protected', validateJwt, (req, res, next) => {
    res.json({
        status: StatusCodes.SUCCESS,
        data: { msg: "This is a protected data" }
    })
})
