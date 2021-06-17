const { Router } = require('express')
const { auth } = require('../middleware/auth')
const { catchAsync } = require('../middleware/errors')

const router = Router()

router.get('/home', auth, catchAsync(async (req, res) => {
    // 2 methods, remove the unwanted fields
    // or use a Mongoose model (see user.ts -> end)
    //const user = await User.findById(req.session!.userId)



    //const user = await User.findById(req.session!.userId).select('-password -__v')
    res.json(user)

    res.end()

    return true
}))

module.exports = {
    router
}