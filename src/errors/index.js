class HttpError {
    constructor (message = 'Generic HTTP Error') {
        this.message = message
    }
}

class BadRequest extends HttpError {
    constructor (message = 'Bad Request', a, b) {
        super(message)
        this.status = 400
    }
}

class Unauthorized extends HttpError {
    constructor (message = 'Unauthorized') {
        super(message)

        this.status = 422
    }
}

module.exports = {
    HttpError,
    BadRequest,
    Unauthorized
}