require('dotenv').config()

const {
    SALT_ROUND_NUMBER,
    BCRYPT_WORK_FACTOR,
    BCRYPT_MAX_BYTES,
    TOKEN_EXPIRATION_TIME
} = process.env


module.exports = {
    SALT_ROUND_NUMBER,
    BCRYPT_WORK_FACTOR,
    BCRYPT_MAX_BYTES,
    TOKEN_EXPIRATION_TIME
}