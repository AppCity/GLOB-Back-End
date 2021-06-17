const { TOKEN_EXPIRATION_TIME } = require('./config/auth')

const generateAccessToken = (user) => {
    return jwt.sign(
        user,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: TOKEN_EXPIRATION_TIME.toString() + 's' }
    )
}


const isLoggedIn = (req) => false

const logIn = (req, userId) => {}

const logOut = () => {}

module.exports = {
    isLoggedIn,
    logIn,
    logOut
}