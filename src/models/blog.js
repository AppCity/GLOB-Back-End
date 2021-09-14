const bcrypt = require("bcrypt")
const { Schema, model, Document, ObjectId } = require("mongoose")


const blogSchema = new Schema({
    author: ObjectId,
    title: String,
    body: String,
    likes: { type: Number, default: 0 },
    //comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    //img: { data: Buffer, contentType: String }
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