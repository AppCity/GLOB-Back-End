const catchAsync = (handler) =>
    async (...args) => {
        try
        {
            // the args array is = [request, response, next]
            const functionResult = await handler(...args)
            
            // if the main response is not ok, check for errors with next middleware
            if (!args[1].getHeader('content-length'))
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