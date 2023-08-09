import joi from "joi";
const dataMethods = ["body", 'params', 'query', 'headers', 'file']

const validation = (joiSchema) => {
    return (req, res, next) => {
        const validationErr = []
        dataMethods.forEach(ele => {
            if (joiSchema[ele]) {
                const validationResult = joiSchema[ele].validate(req[ele], { abortEarly: false })
                if (validationResult.error) {
                    validationErr.push[validationResult.error.details]
                }
            }
        })
        if (validationErr.lenth > 0) {
            return res.json({ message: "Valdation Error" }, validationErr)
        }
        return next()
    }
}