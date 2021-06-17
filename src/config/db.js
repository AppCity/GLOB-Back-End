require('dotenv').config()

const {
    MONGO_USERNAME = process.env.MONGO_USERNAME,
    MONGO_PASSOWORD = process.env.MONGO_PASSOWORD,
    MONGO_HOST = process.env.MONGO_HOST,
    MONGO_PORT = process.env.MONGO_PORT,
    MONGO_DATABASE = process.env.MONGO_DATABASE
} = process.env

const MONGO_URI = (MONGO_USERNAME)
    ? `mongodb+srv://${MONGO_USERNAME}:${
        encodeURIComponent(MONGO_PASSOWORD)
        }@${MONGO_HOST}/${MONGO_DATABASE}?retryWrites=true&w=majority`
    : `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`

const MONGO_OPTIONS = {
    useNewUrlParser: true,
    //useUnifiedTopoly: true
}


module.exports = {
    MONGO_URI,
    MONGO_OPTIONS
}