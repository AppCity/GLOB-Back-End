const { Router } = require('express')
const { registerSchema } = require("../validation/auth")
const { validate } = require("../validation/joi")
const { User } = require("../models/user")

const { logIn } = require("../auth")
const { catchAsync } = require('../middleware/errors')
const { guest, auth } = require('../middleware/auth')
const { BadRequest } = require('../errors')
const { getUserDetails } = require("../utils/userUtils")

const router = Router()

router.post('/signup', guest, catchAsync(async (req, res) => {

    await validate(registerSchema, req.body)
    
    const { fullname, username, phone, email, password } = req.body

    // search if a user with the same username is alredy signed up
    const usernameFound = await User.exists({ username })

    if (usernameFound) {
        throw new BadRequest('Invalid username')
    }

    // create new user and save it inside the DB
    const user = await User.create({
        fullname,
        username,
        phone,
        email,
        password
    })

    // login the just signed up user
    const { accessToken, refreshToken } = logIn(req, user)

    // add refreshToken to added user
    user.refreshToken = refreshToken;
    const result = await user.save();

    // respond with the token and user details
    const responseBody = await getUserDetails(user, accessToken)
    res.json(responseBody)

    res.end()

    return true
}))


router.get('/users', auth, catchAsync(async (req, res) => {
    const users = await User.findById(req.user.id)

    res.json(users)
}))

module.exports = {
    router
}