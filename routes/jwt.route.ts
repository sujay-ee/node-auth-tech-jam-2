import * as express from 'express'
import { StatusCodes } from 'shared/statuscodes'
import { 
    getAllUsers, 
    registerNewUser, 
    signIn,
    findUserByEmail
} from '../services/jwt.service'

export const router = express.Router()

router.get('/', (req, res) => {
    res.json({
        data: { msg: "JWT homepage" },
        status: StatusCodes.SUCCESS
    })
})

router.post('/register', (req, res) => {
    const { email, password, role } = req.body

    // Input data validation
    if (!email || !password || !role) {
        res.status(400).json({ 
            status: StatusCodes.INVALID_DATA_FORMAT 
        })
        return
    }

    // Check if user already exists
    if (findUserByEmail(email)) {
        res.status(400).json({ 
            status: StatusCodes.EMAIL_ALREADY_EXISTS 
        })
        return
    }

    // Register the new user
    const user = registerNewUser(email, password, role)
    res.status(201).json({ 
        data: user,
        status: StatusCodes.SUCCESS
    })
})

router.post('/sign_in', (req, res) => {
    const { email, password } = req.body

    // Input data validation
    if (!email || !password) {
        res.status(400).json({ 
            status: StatusCodes.INVALID_DATA_FORMAT 
        })
        return
    }

    const token = signIn(email, password)
    res.send(token)
})

router.get('/users', (req, res) => {
    res.json({ users: getAllUsers() })
})

router.get('/protected', (req, res) => {
    res.send("This is a supposed to be a protected route")
})
