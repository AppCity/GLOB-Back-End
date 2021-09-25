const { Blog } = require("../models/blog")
const { Like } = require("../models/like")
const { Favorite } = require("../models/favorite");

const { RESPONSE_STATUS_OK } = require("../config/constants");

/**
 * Return all the details of the given user to respond to auth requests
 */
const getUserDetails = async (user, accessToken) => {
    const publishedArticles = await getPublishedArticlesNumber(user._id);

    const likedBlogs = await getUserLikes(user._id)
    const favoritedBlogs = await getUserFavorites(user._id)

    return {
        message: RESPONSE_STATUS_OK,
        accessToken,
        userId: user._id,
        fullname: user.fullname,
        username: user.username,
        phone: user.phone,
        email: user.email,
        profileImage: user.image,
        website: (user.website) ? user.website : "",
        dailyReaders: (user.dailyReaders) ? user.dailyReaders : 0,
        publishedArticles,
        likes: likedBlogs,
        favorites: favoritedBlogs
    }
}

/**
 * Return how many blogs are written by the given user
 */
const getPublishedArticlesNumber = async (userId) => {
    return await Blog.countDocuments({ userId });
}

/**
 * Return all liked blogs of given user.
 */
const getUserLikes = async (userId) => {
    return (await Like.find({ userId, active: true }).sort({ createdAt:-1 }).select('blogId')).map((liked) => liked.blogId)
}
/**
 * Return all favorites blogs of given user.
 */
const getUserFavorites = async (userId) => {
    return (await Favorite.find({ userId, favorite: true }).sort({ createdAt:-1 }).select('blogId')).map((favorite) => favorite.blogId)
}

module.exports = {
    getUserDetails
}