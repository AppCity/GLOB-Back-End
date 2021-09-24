const { Router } = require("express")
const { guest, auth } = require("../middleware/auth")
const { catchAsync } = require("../middleware/errors")
const { Blog } = require("../models/blog")
const { User } = require("../models/user")
const { Like } = require("../models/like")
const { Unauthorized, BadRequest } = require("../errors/index")
const { RESPONSE_STATUS_OK, RESPONSE_STATUS_ERROR } = require("../config/constants")

const url = require('url');
const mongoose = require('mongoose');

const router = Router()

/**
 * Create a new blog
 */
router.post('/blogs', auth, catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id)

    //await validate(loginSchema, req.body)
    const { category, title, headline, content, image } = req.body

    // TODO how to add the image.

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

    // respond with ok status
    res.json({ message: RESPONSE_STATUS_OK, id: blog._id })

    res.end()

    return true
}))

/**
 * Edit properties of an existing blog or like/unlike a blog
 */
router.put('/blogs', auth, catchAsync(async (req, res) => {
    const edited = req.body

    if (!edited.id) {
        throw new BadRequest('Blog ID is needed to edit it!')
    }

    if (!edited.userId) {
        const user = await User.findById(req.user.id)
        edited.userId = user._id
    }
    else {
        edited.userId = (typeof edited.userId == "string") ? mongoose.Types.ObjectId(edited.userId) : edited.userId
    }

    let isValidLike = true;

    // like/unlike a blog
    if (edited.active != undefined) {
        isValidLike = await likeTheBlog(edited)
    }
    // edit a blog
    else {
        // TODO how to add the image.

        // get blog with given id and userid
        const { id, userId, ...newBlog } = edited
        const filter = { _id: mongoose.Types.ObjectId(id), userId }

        const oldBlog = await Blog.findOneAndUpdate(filter, newBlog)

        if (!oldBlog) {
            throw new BadRequest('A blog with id ' + id + ' written by ' + userId + ' has not been found')
        }

        // const blog = await Blog.findOne(filter);
        // console.log("newBlog: ", blog);
    }

    // respond with ok status
    res.json((isValidLike)
         ? { message: RESPONSE_STATUS_OK }
        : { message: RESPONSE_STATUS_ERROR, description: "Already liked" })

    res.end()

    return true
}))

/**
 * Delete a blog
 */
 router.delete('/blogs', auth, catchAsync(async (req, res) => {
    // get request parameters
    const params = url.parse(req.url,true).query;

    if (!params.id) {
        throw new BadRequest('Blog ID is needed to delete it!')
    }

    if (!params.userId) {
        const user = await User.findById(req.user.id)
        params.userId = user._id
    }
    else {
        edited.userId = (typeof edited.userId == "string") ? mongoose.Types.ObjectId(edited.userId) : edited.userId
    }
        
    // delete blog with given id and userid
    const filter = { _id: mongoose.Types.ObjectId(params.id), userId: params.userId }
    const oldBlog = await Blog.deleteOne(filter)

    // if no blogs have been deleted, throw an error
    if (!oldBlog || !oldBlog.deletedCount) {
        throw new BadRequest('A blog with id ' + params.id + ' written by ' + params.userId + ' has not been found')
    }

    res.json({ message: RESPONSE_STATUS_OK })

    res.end()

    return true
}))

/**
 * Get all blogs, filtered by id, user, "pagination" or category parameters
 */
 router.get('/blogs', catchAsync(async (req, res) => {

    // get request parameters
    const params = url.parse(req.url,true).query;

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
    
    let blogs = await Blog.find(filter).sort({createdAt:-1}).skip(offset).limit(pageSize)

    // if the request is from a logged in user, return also its liked/favorite posts
    let userId = ""
    auth(req, res, () => {})
    if (params.userId) {
        userId = params.userId
    }
    else if (req.user && req.user.id) {
        userId = mongoose.Types.ObjectId(req.user.id)
    }

    if (userId) {
        // get all the request blogs ids
        const ids = blogs.map((blog) => blog._id)

        // get all the blogs from the previous list liked by the user
        const liked = await getUserLikes(userId, ids)

        // merge the list of all requested blog with the liked ones
        blogs = mergeArrays(blogs, liked, "_id")
        
        // sort the result by creation date (desc order)
        blogs.sort(
            (a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }


    res.json(blogs)

    res.end()

    return true
}))

//////////////////////////////////////////
// Utils
//////////////////////////////////////////

const likeTheBlog = async (likeParams) => {
    const { id, userId, active } = likeParams

    // search if current user has previously liked this blog
    const likeFilter = { userId: mongoose.Types.ObjectId(userId), blogId: id }
    
    // if no reference is found, the blog is not liked by current user
    const likeReference = await Like.findOne(likeFilter)

    // if reference value and given value are the same,
    // or no reference but given value is "dislike", return error
    if ((likeReference && (likeReference.active === active)) ||
        (!likeReference && !active)) {
        return false;
    }

    // if not already liked and like is active, add a new reference document
    if (!likeReference && active) {
        const newLikeReference = await Like.create({ ...likeFilter, active })
    }
    // if is already liked, update the current reference
    else if (likeReference) {
        const newLikeReference = await Like.updateOne(likeFilter, { active })
    }

    // if there isn't the reference and it is a like request
    // or requested active is not the same as old one, increase/decrease the counter
    if ((!likeReference && active) || (likeReference && likeReference.active != active)) {
        // get the blog and increase/decrease its counter
        const filter = { _id: mongoose.Types.ObjectId(id) }
        const update = (!likeReference || !likeReference.active) ? 1 : -1

        const incResult = await Blog.updateOne(
            filter,
            { "$inc": { "likes": update } }
        )
    }

    return true;
}



/**
 * Return all liked blogs by given user.
 */
 const getUserLikes = async (userId, ids) => {
    return await Blog.aggregate([

        // Consider only the given blogs to not make heavy queries
        { "$match": { "_id": { "$in": ids } } },

        // Join with user_info table
        {
            $lookup:{
                from: "likes",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "blogId", // name of userinfo table field
                as: "likes_info"         // alias for userinfo table
            }
        },
        {   $unwind: "$likes_info" },     // $unwind used for getting data in object or for one record only

        // define which fields are you want to fetch
        {   
            $project:{
                _id: 1,
                likes: 1,
                category: 1,
                title: 1,
                headline: 1,
                content: 1,
                image: 1,
                userId: "$likes_info.userId", // the ID of the user which liked the post
                activeLike: "$likes_info.active",
                createdAt: 1
            } 
        },

        // define some conditions here 
        {
            $match:{
                "activeLike" : true,
                "userId" : userId
           }
        },
    ]);
}

/**
 * Merge 2 arrays a and b overwriting data with same value for prop
 */
const mergeArrays = (a, b, prop) => {
    var reduced = a.filter(aitem => {
        return !b.find(bitem => ""+aitem[prop] === ""+bitem[prop])
    })
    return reduced.concat(b);
}

//////////////////////////////////////////
// Exports
//////////////////////////////////////////

module.exports = {
    router
}