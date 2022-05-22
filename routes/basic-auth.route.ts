import * as express from 'express'
import { getAllUsers } from '../datastore/basic-auth.store'
import { validateUser, registerNewUser } from '../services/basic-auth.service'

export const router = express.Router()

router.get('/', (req, res) => {
    res.send("Basic Auth homepage")
})

router.post('/register', async (req, res) => {
    // TODO Check if the user already exists
    // TODO perform email and password validity check

    const email = req.body.email
    const password = req.body.password
    const user = await registerNewUser(email, password)
    res.status(201).json({ data: user })
})

router.get('/users', (req, res) => {
    res.json({ users: getAllUsers() })
})

router.get('/protected', validateUser, (req, res) => {
    res.send("This is a supposed to be a protected route")
})
