import connectDB from "../DB/connection.js"
import categoryRouter from "./modules/category/category.router.js"
import userRouter from "./modules/user/user.router.js"



const initApp = (app, express) => {
    //convert Buffer Data
    app.use(express.json())
    app.use('/user', userRouter)
    app.use('/user', categoryRouter)

    app.use('*', (req, res, next) => {
        res.json("In-valid Routing❌ check url  or  method")
    })
    connectDB()
}
export default initApp