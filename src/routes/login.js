const { Router } = require("express")
const { guest, auth } = require("../middleware/auth")
const { catchAsync } = require("../middleware/errors")
const { User } = require("../models/user")
const { validate } = require("../validation/joi")
const { loginSchema } = require("../validation/auth")
const { Unauthorized } = require("../errors/index")
const { logIn, logOut } = require("../auth")
const { RESPONSE_STATUS_OK, RESPONSE_STATUS_ERROR } = require("../config/constants")

const router = Router()

router.post('/login', guest, catchAsync(async (req, res) => {
    await validate(loginSchema, req.body)
    const { username, password } = req.body

    const user = await User.findOne({ username })

    /*
      This code is vulnerable to TimingAttack,
      that is when with a lot of request I can undestand when the password is wrong
      and when the username is wrong instead, as the password validation requires more time.
    */
    if (!user || !(await user.matchesPassword(password))) {
        throw new Unauthorized('Incorrect email or password')
    }

    const { accessToken, refreshToken } = logIn(req, user)

    // add refreshToken to the user
    user.refreshToken = refreshToken
    const result = await user.save()

    // respond with the two tokens
    res.json({ message: RESPONSE_STATUS_OK, accessToken })

    res.end()

    return true
}))

router.get('/logout', auth, catchAsync(async(req, res) => {
    const user = await User.findById(req.user.id)

    /*
      This code is vulnerable to TimingAttack,
      that is when with a lot of request I can undestand when the password is wrong
      and when the username is wrong instead, as the password validation requires more time.
    */
    if (!user) {
        throw new Unauthorized('Incorrect token for current user')
    }

    if (!(await logOut(user)))
        throw new Unauthorized('Logout is currently impossible')

    res.json({ messsage: RESPONSE_STATUS_OK }).status(204)
    
    res.end()

    return true
}))

module.exports = {
    router
}