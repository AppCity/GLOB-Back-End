const { Router } = require('express')
const { registerSchema } = require("../validation/auth")
const { validate } = require("../validation/joi")
const { User } = require("../models/user")

const { logIn } = require("../auth")
const { catchAsync } = require('../middleware/errors')
const { guest } = require('../middleware/auth')
const { BadRequest } = require('../errors')

const router = Router()

router.post('/signup', guest, catchAsync(async (req, res) => {

    console.log("HEEERE!")

    await validate(registerSchema, req.body)
    
    const { email, name, password } = req.body

    const found = await User.exists({ email })

    if (found) {
        throw new BadRequest('Invalid email')
    }

    const user = await User.create({
        email, name, password
    })

    //logIn(req, user.id)

    res.json({message: 'OK'})

    res.end()

    return true
}));


router.get('/users', /*authenticateToken,*/ (req, res) => {
    res.json(users)
})

module.exports = {
    router
}