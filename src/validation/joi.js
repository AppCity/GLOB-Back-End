const { BadRequest } = require('../errors')

const validate = async (schema, payload) => {
    try {
        // validate the received message using the validation/auth joi model
        await schema.validateAsync(payload, { abortEarly: false})
    } catch (e) {
        // write the error string with missing things on the message
        const details = e.details
        let errorMessage = []

        details.forEach(element => {
            errorMessage.push(element.message);
        });

        throw new BadRequest(errorMessage)
    }
}

module.exports = {
    validate
}