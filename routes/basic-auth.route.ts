import * as express from 'express'
import { 
    getAllUsers, 
    validateUser, 
    registerNewUser,
    findUserByEmail
} from '../services/basic-auth.service'
import { StatusCodes } from '../shared/statuscodes'

export const router = express.Router()

router.get('/', (req, res) => {
    res.json({
        data: { msg: "Basic auth homepage" },
        status: StatusCodes.SUCCESS
    })
})

router.post('/register', async (req, res) => {
    const { email, password } = req.body

    // Ensure the input data is valid
    if (!email || !password) {
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

    const user = await registerNewUser(email, password)
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

router.get('/protected', validateUser, (req, res) => {
    res.json({
        data: { msg: "This is protected data" },
        status: StatusCodes.SUCCESS
    })
})
