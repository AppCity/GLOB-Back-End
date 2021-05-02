import Joi from "@hapi/joi";
import { BCRYPT_MAX_BYTES } from "../config";

const email = Joi.string().email().min(8).max(254).lowercase().trim().required()
const name = Joi.string().min(3).max(128).trim().required()
// emoji, accented letters, etc. uses more than 1 byte to be saved.
// noi dobbiamo tenere conto che bcrypt ha un limite massimo di byte in input di 72
const password = Joi.string().min(8).max(BCRYPT_MAX_BYTES, 'utf8')
    .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
    .message('"{#label}" must contains at least one UpperCase letter, one lowerCase letter and 1 digit')
    .required()
const passwordConfirmation = Joi.valid(Joi.ref('password')).required()

export const registerSchema = Joi.object({
    email,
    name,
    password,
    passwordConfirmation
})

export const loginSchema = Joi.object({
    email,
    password
})