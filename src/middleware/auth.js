const { isLoggedIn, logOut } = require('../auth')
const { Unauthorized } = require('../errors')

const guest = (req, res, next) => {
    if (isLoggedIn(req)) {
        return next(new Unauthorized('You are already logged in'))
    }

    next()
}

const auth = (req, res, next) => {
    if (!isLoggedIn(req)) {
        return next(new Unauthorized('You must be logged in'))
    }

    next()
}

const active = async (req, res, next) => {
    if (isLoggedIn(req)) {
        const now = Date.now()
        const { createdAt } = req.session //as Express.Session

        /*
        if (!createdAt || now > createdAt + SESSION_ABSOLUTE_TIMEOUT) {
            await logOut(req, res)

            return next(new Unauthorized('Session Expired'))
        }
        */
    }

    //next()
}


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // authHeader is equals to -> Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    if (!token)
        return res.sendStatus(401)
    
    // there is a valid token in the request
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // user has a token but is not anymore valid
        if (err)
            return res.sendStatus(403)
        
        req.user = user
        console.log(req.user)
        next()
    })
}

module.exports = {
    guest,
    auth,
    active,
    authenticateToken
}