const { Schema, model, Document, ObjectId } = require("mongoose")

/**
 * A schema model to save all the reference user - blog they liked.
 */
const likeSchema = new Schema({
    userId: ObjectId,
    blogId: ObjectId,
    active: { type: Boolean, default: true },
}, {
    timestamps: true
})

// Action which runs before the document is added/updated to the collection.
likeSchema.pre('save', async function () {
    // if (this.isModified('password')) {
    //     this.password = hashedPassword;
    // }
})

likeSchema.set('toJSON', {
    transform: (doc, {__v, password, ...rest}, options) => rest
})

const Like = model('Like', likeSchema)

module.exports = {
    Like
}