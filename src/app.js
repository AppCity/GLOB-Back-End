const express = require('express')

const { serverError, notFound, catchAsync } = require('./middleware/errors')
const home = require('./routes/home')
const login = require('./routes/login')
const register = require('./routes/register')
const users = require('./routes/users')
const blogs = require('./routes/blogs')
const favorites = require('./routes/favorites')
const categories = require('./routes/categories')


const createApp = () => {
    const app = express();

    app.use(express.json())

    app.use(login.router)

    app.use(register.router)

    app.use(users.router)

    app.use(home.router)

    app.use(blogs.router)

    app.use(favorites.router)

    app.use(categories.router)

    app.use(notFound)

    app.use(serverError)
        
    return app
}

module.exports = {
    createApp
}