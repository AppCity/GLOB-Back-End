const express = require('express')

const { active } = require('./middleware/auth')
const { serverError, notFound, catchAsync } = require('./middleware/errors')
const home = require('./routes/home')
const login = require('./routes/login')
const register = require('./routes/home')


const createApp = () => {
    const app = express();

    app.use(express.json())

    app.use(catchAsync(active))

    app.use(login.router)

    app.use(register.router)

    app.use(home.router)

    app.use(notFound)

    app.use(serverError)
        
    return app
}

module.exports = {
    createApp
}