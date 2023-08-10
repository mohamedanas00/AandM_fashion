export const asyncHandler = (fn) => {
    return (req, res, next) => {
        return fn(req, res, next).catch(error => {
            return next(new Error(error))
        })
    }
}

export const golbalErrorHandling = (error, req, res, next) => {
    return res.json({
        message: 'G error',
        mesgError: error.message,
        stack: error.stack
    })
}

