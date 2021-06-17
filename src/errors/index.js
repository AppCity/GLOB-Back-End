class HttpError {
    constructor () {
        this.message = "Generic HTTP Error"
    }
}

class BadRequest extends HttpError {
    constructor (message = 'Bad Request') {
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