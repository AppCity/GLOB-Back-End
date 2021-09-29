const { Router } = require("express")
const { auth } = require("../middleware/auth")
const { catchAsync } = require("../middleware/errors")
const { getUserFavorites } = require("./blogs")
const { RESPONSE_STATUS_OK, RESPONSE_STATUS_ERROR } = require("../config/constants")

const url = require('url');
const mongoose = require('mongoose');


const router = Router()

/**
 * Get all favorite blogs of a certain user
 */
 router.get('/favorites', catchAsync(async (req, res) => {

    // get request parameters
    const params = url.parse(req.url,true).query;

    let filter = {}
    
    // if the request is from a logged in user, return favorite posts
    let userId = ""
    auth(req, res, () => {})
    if (params.userId) {
        userId = mongoose.Types.ObjectId(params.userId)
    }
    else if (req.user && req.user.id) {
        userId = mongoose.Types.ObjectId(req.user.id)
    }

    let blogs = [];
    if (userId) {
        // get all the blogs from the previous list that user added to favorite list
        blogs = await getUserFavorites(userId, null)

        // sort the result by creation date (desc order)
        blogs.sort(
            (a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        // remove unused props and put mongo id into id field
        blogs = blogs.map((currentBlog) => {
            const {_id, __v, updatedAt, likedBy, favoritedBy, ...clearedBlog} = (currentBlog._doc) ? currentBlog._doc : currentBlog
            clearedBlog.id = _id
            return clearedBlog
        });
    }


    if (blogs.length == 1 && params.id)
        res.json(blogs[0])
    else if (blogs.length < 1 && params.id)
        res.json({})
    else
        res.json(blogs)


    res.end()

    return true
}))

//////////////////////////////////////////
// Exports
//////////////////////////////////////////

module.exports = {
    router
}