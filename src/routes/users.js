const { Router } = require('express')
const { User } = require("../models/user")

const { catchAsync } = require('../middleware/errors')
const { auth } = require('../middleware/auth')
const { BadRequest } = require('../errors')
const { getUserDetails } = require("../utils/userUtils")
const { RESPONSE_STATUS_OK, RESPONSE_STATUS_ERROR } = require("../config/constants")

const mongoose = require('mongoose');

const router = Router()

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

// Get user's details
router.get('/user', auth, catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id)

    const responseBody = await getUserDetails(user, "")

    res.json(responseBody)
}))

// Delete user from DB
router.delete('/user', auth, catchAsync(async (req, res) => {
    const params = url.parse(req.url, true).query;

    // filter by blog id
    if (!params || !params.userId) {
        throw new BadRequest('UserId is a required parameter to delete a user.')
    }

    const user = await User.deleteOne({ _id: mongoose.Types.ObjectId(params.userId) })

    res.json({ message: (user && user.deletedCount) ? RESPONSE_STATUS_OK : RESPONSE_STATUS_ERROR })
}))


module.exports = {
    router
}