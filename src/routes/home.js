const { Router } = require('express')
const { auth } = require('../middleware/auth')
const { catchAsync } = require('../middleware/errors')
const { User } = require('../models/user')

const router = Router()

///////////////////////////////////////////
// Main Requests Server Section
///////////////////////////////////////////
const posts = [
    {
        username: 'giovannivolpin',
        title: 'Post 1'
    },
    {
        username: 'jim',
        title: 'Post 2'
    },
    {
        username: 'giovannivolpin',
        title: 'Post 3'
    },
    {
        username: 'giovannivolpin',
        title: 'Post 4'
    },
    {
        username: 'jim',
        title: 'Post 5'
    },
    {
        username: 'giovannivolpin',
        title: 'Post 6'
    },

]

router.get('/', auth, catchAsync(async (req, res) => {
    res.json({ message: "Not Implemented Yet!"})

    res.end()

    return true
}))

router.get('/home', auth, catchAsync(async (req, res) => {
    // 2 methods, remove the unwanted fields
    // or use a Mongoose model (see user.ts -> end)

    const dataToRemove = '-password -__v -refreshToken -createdAt -updatedAt'

    const user = await User.findById(req.user.id).select(dataToRemove)

    // only get posts from currently logged in user
    res.json(posts.filter(post => post.username === user.username ))

    res.end()

    return true
}))

module.exports = {
    router
}