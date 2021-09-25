const { Blog } = require("../models/blog")

const { RESPONSE_STATUS_OK } = require("../config/constants")

/**
 * Return all the details of the given user to respond to auth requests
 */
const getUserDetails = async (user, accessToken) => {
    const publishedArticles = await getPublishedArticlesNumber(user._id);

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
        publishedArticles
    }
}

/**
 * Return how many blogs are written by the given user
 */
const getPublishedArticlesNumber = async (userId) => {
    return await Blog.countDocuments({ userId });
}

/**
 * Return all favorites blogs of given user.
 */
const getUserFavorites = async (userId) => {
    
}

module.exports = {
    getUserDetails
}