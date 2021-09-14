const { Router } = require("express")
const { guest, auth } = require("../middleware/auth")
const { catchAsync } = require("../middleware/errors")
const { Blog } = require("../models/blog")
const { User } = require("../models/user")
const { Unauthorized, BadRequest } = require("../errors/index")
const { RESPONSE_STATUS_OK, RESPONSE_STATUS_ERROR } = require("../config/constants")

const url = require('url');

const router = Router()

/**
 * Create a new blog
 */
router.post('/blogs', auth, catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id)

    //await validate(loginSchema, req.body)
    const { category, title, headline, content, image } = req.body

    // TODO how to add the image and the comment list.

    // create new user and save it inside the DB
    const blog = await Blog.create({
        userId: user._id,
        category,
        title,
        headline,
        content,
        image,
        likes: 0
    })

    console.log("NEW BLOG: ", blog);

    // respond with the two tokens
    res.json({ message: RESPONSE_STATUS_OK })

    res.end()

    return true
}))


/**
 * Get all blogs, filtered by id, user, "pagination" or category parameters
 */
 router.get('/blogs', auth, catchAsync(async (req, res) => {

    // get request parameters
    const params = url.parse(req.url,true).query;

    console.log("PARAMS ", params)

    let filter = {}
    
    // filter by blog id
    if (params.id)
        filter = { _id: params.id }

    // filter by userId
    if (params.userId)
        filter = { ...filter, userId: params.userId}

    // filter by category
    if (params.category)
        filter = { ...filter, category: params.category}

    // pagination section
    const page = (params.page) ? parseInt(params.page) : 0
    const pageSize = (params.size) ? parseInt(params.size) : 0
    const offset = (page - 1) * pageSize

    // field to remove from the result
    const dataToRemove = '-createdAt -updatedAt'
    
    const blogs = await Blog.find(filter).sort({createdAt:-1}).skip(offset).limit(pageSize)

    res.json(blogs)

    res.end()

    return true
}))

module.exports = {
    router
}