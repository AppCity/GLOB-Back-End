const catchAsync = (handler) =>
    async (...args) => {
        try
        {
            const functionResult = await handler(...args)
            // TODO search when I have to pass this
            //if (!args[1].getHeader('set-cookie'))
                args[2]()
        }
        catch (err)
        {
            args[2](err)
        }
    }

const notFound = (req, res, next) => {
    console.log(res.getHeaders())
    res.status(404).json({ message: 'Not Found' })
}

const serverError = (err, req, res, next) => {
    if (!err.status) {
        console.error(err.stack)
    }
    res.status(err.status || 500).json ({ message: err.message || "Internal Server Error" })
}

module.exports = {
    catchAsync,
    notFound,
    serverError
}