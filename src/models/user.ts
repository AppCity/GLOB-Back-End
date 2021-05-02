import { compare, hash } from "bcryptjs";
import mongoose, { Schema, model, Document } from "mongoose";
import { BCRYPT_WORK_FACTOR } from "../config";
import { register } from "../routes";

interface UserDocument extends Document {
    email: string
    name: string
    password: string
    matchesPassword: (password: string) => Promise<boolean>
}

const userSchema = new Schema({
    email: String,
    name: String,
    password: String
}, {
    timestamps: true
})

userSchema.pre<UserDocument>('save', async function () {
    if (this.isModified('password')) {
        this.password = await hash(this.password, BCRYPT_WORK_FACTOR)
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
userSchema.methods.matchesPassword = function(password: string) {
    let userDoc = this as UserDocument
    return compare(password, userDoc.password)
}

userSchema.set('toJSON', {
    transform: (doc: UserDocument, {__v, password, ...rest}: any, options:any) => rest
})

export const User = model<UserDocument>('User', userSchema)