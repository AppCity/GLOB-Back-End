const { Router } = require('express')
const { registerSchema } = require("../validation/auth")
const { validate } = require("../validation/joi")
const { User } = require("../models/user")

const { logIn } = require("../auth")
const { catchAsync } = require('../middleware/errors')
const { guest, auth } = require('../middleware/auth')
const { BadRequest } = require('../errors')
const { getUserDetails } = require("../utils/userUtils")
const { RESPONSE_STATUS_OK, RESPONSE_STATUS_ERROR } = require("../config/constants")

const mongoose = require('mongoose');

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

///////////////////////////////////////
// Users
///////////////////////////////////////

// Edit users fields
router.put('/user', auth, catchAsync(async (req, res) => {
    const edited = req.body

    if (!edited.userId) {
        const user = await User.findById(req.user.id)
        edited.userId = user._id
    }
    else {
        edited.userId = (typeof edited.userId == "string") ? mongoose.Types.ObjectId(edited.userId) : edited.userId
    }

    // TODO how to add the profile image.

    // get user from given userid
    const { userId, ...remaining } = edited
    const filter = { _id: userId }

    // add only the editable fields
    const editedUser = {
        username: remaining.username,
        fullname: remaining.fullname,
        email: remaining.email,
        phone: remaining.phone,
        profileImage: remaining.profileImage
    }

    const oldUser = await User.updateOne(filter, editedUser)

    if (!oldUser || !oldUser.nModified) {
        throw new BadRequest('Something wrong modifying user')
    }

    // respond with ok status
    res.json({ message: RESPONSE_STATUS_OK })

    res.end()

}))


router.get('/user', auth, catchAsync(async (req, res) => {
    const users = await User.findById(req.user.id)

    res.json(users)
}))

module.exports = {
    router
}