const Joi = require("joi")
const { BCRYPT_MAX_BYTES } = require("../config/auth")

const fullname = Joi.string().min(3).max(128).trim().required()
const username = Joi.string().min(3).max(128).trim().required()
const phone = Joi.string().min(3).max(128).trim().required()
const email = Joi.string().email().min(8).max(254).lowercase().trim().required()
// emoji, accented letters, etc. uses more than 1 byte to be saved.
// noi dobbiamo tenere conto che bcrypt ha un limite massimo di byte in input di 72
const password = Joi.string().min(8).max(BCRYPT_MAX_BYTES)
    .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
    .message('"{#label}" must contains at least one UpperCase letter, one lowerCase letter and 1 digit')
    .required()
//const passwordConfirmation = Joi.valid(Joi.ref('password')).required()

// login password must not return needed details about password 
const loginPassword = Joi.string().min(8).required()

// schema for registration request
const registerSchema = Joi.object({
    fullname,
    username,
    phone,
    email,
    password,
    //passwordConfirmation
})

// schema for login request
const loginSchema = Joi.object({
    username,
    password: loginPassword
})

module.exports = {
    registerSchema,
    loginSchema
}