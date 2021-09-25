const { Schema, model, Document, ObjectId } = require("mongoose")

/**
 * A schema model to save all the reference user - blog they liked.
 */
const favoriteSchema = new Schema({
    userId: ObjectId,
    blogId: ObjectId,
    favorite: { type: Boolean, default: true },
}, {
    timestamps: true
})

// Action which runs before the document is added/updated to the collection.
favoriteSchema.pre('save', async function () {
    // if (this.isModified('password')) {
    //     this.password = hashedPassword;
    // }
})

favoriteSchema.set('toJSON', {
    transform: (doc, {__v, password, ...rest}, options) => rest
})

const Favorite = model('Favorite', favoriteSchema)

module.exports = {
    Favorite
}