import connectDB from "../DB/connection.js"
import categoryRouter from "./modules/category/category.routes.js"
import subcategoryRouter from "./modules/subcategory/subcategory.routes.js"
import userRouter from "./modules/user/user.routes.js"



const initApp = (app, express) => {
    //convert Buffer Data
    app.use(express.json())
    app.use('/user', userRouter)
    app.use('/category', categoryRouter)
    app.use('/subcategory', subcategoryRouter)
    app.use('*', (req, res, next) => {
        res.json("In-valid Routing check url  or  method")
    })
    connectDB()
}
export default initApp