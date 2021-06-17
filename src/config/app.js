require('dotenv').config()

const {
    NODE_ENV,
    PORT,
} = process.env

const IN_PROD = NODE_ENV === 'production'

module.exports = {
    NODE_ENV,
    PORT,
    IN_PROD
}