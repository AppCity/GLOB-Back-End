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

// method which says if the session/token is expired
// TODO -> come farlo con i token? è possibile??
const active = async (req, res, next) => {
    if (isLoggedIn(req)) {
        //const now = Date.now()
        //const { createdAt } = req.session //as Express.Session

        console.log("ACTIVE HAS BEEN ENTERED!")

        /*
        if (!createdAt || now > createdAt + SESSION_ABSOLUTE_TIMEOUT) {
            await logOut(req, res)

            return next(new Unauthorized('Session Expired'))
        }
        */
    }

    //next()
}


module.exports = {
    guest,
    auth,
    active
}