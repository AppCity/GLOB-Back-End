const bcrypt = require("bcrypt")
const { Schema, model, Document, ObjectId } = require("mongoose")


const blogSchema = new Schema({
    userId: ObjectId,
    category: String,
    title: String,
    headline: String,
    content: String,
    image: String,
    likes: { type: Number, default: 0 },
}, {
    timestamps: true
})

// Action which runs before the document is added/updated to the collection.
blogSchema.pre('save', async function () {
    // if (this.isModified('password')) {
    //     this.password = hashedPassword;
    // }
})

blogSchema.set('toJSON', {
    transform: (doc, {__v, password, ...rest}, options) => rest
})

const Blog = model('Blog', blogSchema)

module.exports = {
    Blog
}