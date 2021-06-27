const jwt = require('jsonwebtoken')

const { TOKEN_EXPIRATION_TIME, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('./config/auth')

///////////////////////////////////////////
// Generate the token
///////////////////////////////////////////
const generateAccessToken = (payload) => {
    const expiresIn = TOKEN_EXPIRATION_TIME + 's'
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: expiresIn })
}

const serializeUserOnToken = (user) => {
    // what we want to serialize inside the token
    return {
        id: user.id
    }
}

///////////////////////////////////////////
// Is the user logged in?
///////////////////////////////////////////
const isLoggedIn = (req, isRefresh = false) => {
    const authHeader = req.headers['authorization']
    // authHeader is equals to -> Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1]

    if (!token)
        return false
    
    let errorName
    // there is a valid token in the request
    jwt.verify(token, ACCESS_TOKEN_SECRET, {ignoreExpiration: isRefresh}, (err, user) => {
        // user has a token but is not anymore valid
        if (err && !isRefresh) {
            req.user = null
            if (err.name === "JsonWebTokenError" || err.name === "SyntaxError")
                errorName = "AuthorizationError"
            else if (err.name === "TokenExpiredError")
                errorName = "Expired"
        }
        else {
            // add the userId saved in the token inside the request
            req.user = user
        }
    })
    
    // user has a valid token if "user" option has been set
    return { loginResult: !(req.user === undefined || req.user === null), errorName }
}

///////////////////////////////////////////
// Login the user
///////////////////////////////////////////

const logIn = (req, user) => {
    // what we want to serialize inside the token
    const tokenData = serializeUserOnToken(user)

    // create the two tokens
    const accessToken = generateAccessToken(tokenData)
    const refreshToken = jwt.sign(tokenData, REFRESH_TOKEN_SECRET)

    return { accessToken, refreshToken }
}

///////////////////////////////////////////
// Logout the user
///////////////////////////////////////////
const logOut = async (user) => {

    // TODO invalidate current accessoToken

    // remove refreshToken from the user
    user.refreshToken = ""
    const result = await user.save()

    return result
}

///////////////////////////////////////////
// Refresh current user's token
///////////////////////////////////////////

const refreshUserToken = (user, refreshToken) => {
    let accessToken;

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
            throw new BadRequest('Token cannot be refreshed')
        
        accessToken = generateAccessToken(serializeUserOnToken(user))
    })

    // return the refreshed accessToken
    return accessToken
}

module.exports = {
    isLoggedIn,
    logIn,
    logOut,
    refreshUserToken
}