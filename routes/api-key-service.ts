import express from 'express'

export const router = express.Router();

router.get('/', (req, res) => {
    res.send("Api key homepage")
})

router.get('/protected', (req, res) => {
    res.send("This is a supposed to be a protected route")
})
