export const asyncHndeler=(fn)=>{
    return (req,res,next)=>{
        return fn (req,res,next).catch(error=>{
            return next(new Error(error, { cause: 500 }))
        })
    }
}

export const globalErrorHandling =(error,req,res,next)=>{
    return res.status(err.cause|| 400).json({msgError: error.message, stack: error.stack})
}