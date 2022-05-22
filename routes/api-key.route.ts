import * as express from 'express'
import { getAllUsers, findUserByEmail, incrementNumUsagesToday } from '../datastore/api-key.store'
import { registerNewUser, validateKey } from '../services/api-key-auth.service'

export const router = express.Router()

router.get('/', (req, res) => {
    res.send("Api key homepage")
})

router.post('/register', (req, res, next) => {
    const email = req.body.email
    const host = req.body.origin

    // Check if the user already exists
    // TODO add this check to `canCreateUser` function in service
    if (findUserByEmail(email)) {
        res.status(400).json({ msg: "User already exists" })
        return
    }

    const user = registerNewUser(email, host)
    res.status(201).json({ data: user })
})

router.get('/users', (req, res) => {
    res.json({ users: getAllUsers() })
})

router.get('/protected', validateKey, (req, res) => {
    const host = req.headers.origin
    const apiKey = req.header('x-api-key')

    const ret = incrementNumUsagesToday(apiKey, host)
    if (!ret) {
        // Control shouldn't reach here,
        // This means that a request was able to get past 
        // the api-key validation using a bad api-key
        res.status(404).send("User not found, try registering again")
    }

    res.send("This is a supposed to be a protected route")
})
