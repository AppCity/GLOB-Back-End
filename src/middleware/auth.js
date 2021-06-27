const { isLoggedIn, logOut } = require('../auth')
const { Unauthorized } = require('../errors')

// method which says if a user is already logged in
const guest = (req, res, next) => {
    if (isLoggedIn(req)) {
        return next(new Unauthorized('You are already logged in'))
    }

    next()
}

// method which says if a user don't have access to content because is not logged in
const auth = (req, res, next) => {
    const { loginResult, errorName } = isLoggedIn(req, req.url.includes("token"))

    if (!loginResult) {
        return next(new Unauthorized((errorName) ? errorName : 'NotLoggedIn'))
    }
    
    next()
}


module.exports = {
    guest,
    auth
}