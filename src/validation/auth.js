const Joi = require("joi")
const { BCRYPT_MAX_BYTES } = require("../config/auth")

const email = Joi.string().email().min(8).max(254).lowercase().trim().required()
const name = Joi.string().min(3).max(128).trim().required()
// emoji, accented letters, etc. uses more than 1 byte to be saved.
// noi dobbiamo tenere conto che bcrypt ha un limite massimo di byte in input di 72
const password = Joi.string().min(8).max(parseInt(BCRYPT_MAX_BYTES))
    .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
    .message('"{#label}" must contains at least one UpperCase letter, one lowerCase letter and 1 digit')
    .required()
const passwordConfirmation = Joi.valid(Joi.ref('password')).required()

const registerSchema = Joi.object({
    email,
    name,
    password,
    passwordConfirmation
})

const loginSchema = Joi.object({
    email,
    password
})

module.exports = {
    registerSchema,
    loginSchema
}