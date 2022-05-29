import * as express from 'express'
import { 
    getAllUsers, 
    validateUser, 
    registerNewUser
} from '../services/basic-auth.service'
import { isValid, StatusCodes } from '../shared/statuscodes'

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

    // Register a new user
    const { status, data } = await registerNewUser(email, password)
    if (!isValid(status)) {
        res.status(400).json({ 
            status: status
        })
        return
    }

    // Return the registered user
    res.status(201).json({ 
        data, 
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
