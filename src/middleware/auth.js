const { isLoggedIn, logOut } = require('../auth')
const { Unauthorized } = require('../errors')
const { User } = require('../models/user')

// method which says if a user is already logged in
const guest = (req, res, next) => {
    if (isLoggedIn(req)) {
        return next(new Unauthorized('You are already logged in'))
    }

    next()
}

// method which says if a user don't have access to content because is not logged in
const auth = async (req, res, next) => {
    const notLoggedIn = 'NotLoggedIn'

    const { loginResult, errorName } = isLoggedIn(req, req.url.includes("token"))

    if (!loginResult) {
        return next(new Unauthorized((errorName) ? errorName : notLoggedIn))
    }

    // validate if the user has been logged out
    const user = await User.findById(req.user.id)
    
    if (!user || !user.refreshToken)
        return next(new Unauthorized(notLoggedIn))

    next()
}


module.exports = {
    guest,
    auth
}