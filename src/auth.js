const jwt = require('jsonwebtoken')

const { TOKEN_EXPIRATION_TIME, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('./config/auth')

///////////////////////////////////////////
// Generate the token
///////////////////////////////////////////
const generateAccessToken = (payload) => {
    const expiresIn = TOKEN_EXPIRATION_TIME + 's'
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: expiresIn })
}

///////////////////////////////////////////
// Is the user logged in?
///////////////////////////////////////////
const isLoggedIn = (req) => {
    const authHeader = req.headers['authorization']
    // authHeader is equals to -> Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1]

    if (!token)
        return false
    
    // there is a valid token in the request
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        // user has a token but is not anymore valid
        if (err)
            req.user = null
        else        
            // add the userId saved in the token inside the request
            req.user = user
    })

    // user has a valid token if "user" option has been set
    return !(req.user === undefined || req.user === null)
}

///////////////////////////////////////////
// Login the user
///////////////////////////////////////////

const logIn = (req, user) => {
    // what we want to serialize inside the token
    const tokenData = {
        id: user.id
    }

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

module.exports = {
    isLoggedIn,
    logIn,
    logOut,
}