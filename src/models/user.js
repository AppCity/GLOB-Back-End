const bcrypt = require("bcrypt")
const { Schema, model, Document } = require("mongoose")
//const { BCRYPT_WORK_FACTOR } = require("../config/auth")
const { SALT_ROUND_NUMBER } = require("../config/auth")


const userSchema = new Schema({
    fullname: String,
    username: String,
    phone: String,
    email: String,
    password: String,
    refreshToken: String
}, {
    timestamps: true
})

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        
        // generate the salt and then the hashed password
        //const salt = bcrypt.genSalt(SALT_ROUND_NUMBER) // default is 10 round, longer it is
        //const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // directly generate the hashed password with the salt inside
        const hashedPassword = await bcrypt.hash(this.password, SALT_ROUND_NUMBER)

        // I don't have to save the salt part, because its information
        // is inside the hashed password itself (bcrypt alg)
        this.password = hashedPassword;        
        

        // OLD VERSION
        //this.password = await hash(this.password, BCRYPT_WORK_FACTOR)
        
        /*
        // we can use also hash + bcrypt
        // The advantage is that the hash function with parameter sha256
        // always produce strings of the same size.
        // So, in this case, we are sure that the resulting hash will always be of the same length.
        const crypto = require('crypto')
        const password = this.password
        const hash = crypto.createHash('sha256').update(password).digest('base64')

        // in this way we got bcrypt hash but based in the sha256 hash of the original password-.
        // In this case we don't have to limit the password field to 72 characters,
        // because using this algorithms we are sure about the encoded password length.
        const bcrypt = require('bcryptjs')
        bcrypt.hash(hash, BCRYPT_WORK_FACTOR, console.log)
        */
    }
    
})

// create a helper method to validate given password with the DB one
userSchema.methods.matchesPassword = async function(password) {
    let userDoc = this
    return await bcrypt.compare(password, userDoc.password)
}

userSchema.set('toJSON', {
    transform: (doc, {__v, password, ...rest}, options) => rest
})

const User = model('User', userSchema)

module.exports = {
    User
}