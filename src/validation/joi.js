const { BadRequest } = require("../errors")

const validate = async (schema, payload) => {
    try {
        await schema.validateAsync(payload, { abortEarly: false})
    } catch (e) {
        throw new BadRequest(e)
    }
}

module.exports = {
    validate
}