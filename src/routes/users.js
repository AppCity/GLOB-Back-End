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
