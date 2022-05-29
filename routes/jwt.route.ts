import * as express from 'express'
import { getAllUsers, registerNewUser, signIn } from '../services/jwt.service'

export const router = express.Router()

router.get('/', (req, res) => {
    res.send("JWT homepage")
})

router.post('/register', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const role = req.body.role

    const user = registerNewUser(email, password, role)
    res.status(201).json({ data: user })
})

router.post('/sign_in', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const token = signIn(email, password)
    res.send(token)
})

router.get('/users', (req, res) => {
    res.json({ users: getAllUsers() })
})

router.get('/protected', (req, res) => {
    res.send("This is a supposed to be a protected route")
})
