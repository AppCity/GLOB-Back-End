const { Router } = require("express")
const { guest, auth } = require("../middleware/auth")
const { catchAsync } = require("../middleware/errors")
const { Category } = require("../models/category")
const { User } = require("../models/user")
const { Unauthorized, BadRequest } = require("../errors/index")
const { RESPONSE_STATUS_OK, RESPONSE_STATUS_ERROR } = require("../config/constants")

const router = Router()

/**
 * Create a new category
 */
router.post('/categories', auth, catchAsync(async (req, res) => {
    const { value, title, image } = req.body

    // search if a category with the same value exists
    const valueFound = await Category.exists({ value })

    if (valueFound) {
        throw new BadRequest('Category with same value exists yet!')
    }

    // TODO how to add the image.

    // create new category and save it inside the DB
    const category = await Category.create({
        value,
        title,
        image
    })

    console.log("NEW Category: ", category)

    // respond with the two tokens
    res.json({ message: RESPONSE_STATUS_OK })

    res.end()

    return true
}))

/**
 * Get the categories list
 */
router.get('/categories', catchAsync(async (req, res) => {

    const dataToRemove = '-createdAt -updatedAt'

    const categoriesList = await Category.find().select(dataToRemove)

    res.json(categoriesList)

    res.end()

    return true
}))

module.exports = {
    router
}