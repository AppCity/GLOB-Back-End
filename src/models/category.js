const { Schema, model, Document, ObjectId } = require("mongoose")


const categorySchema = new Schema({
    value: String,
    title: String,
    image: String,
}, {
    timestamps: true
})

// Action which runs before the document is added/updated to the collection.
categorySchema.pre('save', async function () {
    // if (this.isModified('password')) {
    //     this.password = hashedPassword;
    // }
})

categorySchema.set('toJSON', {
    transform: (doc, {__v, password, ...rest}, options) => rest
})

const Category = model('Category', categorySchema)

module.exports = {
    Category
}