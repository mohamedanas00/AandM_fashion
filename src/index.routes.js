import connectDB from "../DB/connection.js"
import authRouter from "./modules/auth/auth.routes.js"
import brandRouter from "./modules/brand/brand.routes.js"
import cartRouter from "./modules/cart/cart.routes.js"
import categoryRouter from "./modules/category/category.routes.js"
import couponRouter from "./modules/coupon/coupon.routes.js"
import orderRouter from "./modules/order/order.routes.js"
import productRouter from "./modules/product/proutuct.routes.js"
import reviewRouter from "./modules/review/review.routes.js"
import subcategoryRouter from "./modules/subcategory/subcategory.routes.js"
import userRouter from "./modules/user/user.routes.js"
import { golbalErrorHandling } from "./utils/errorHandling.js"
import morgan from 'morgan'


const initApp = (app, express) => {
    //convert Buffer Data
    console.log('Morgan middleware is applied'); // Add this line
    app.use(morgan('tiny'))
    app.use((req,res,next)=>{
        if(req.originalUrl=='/order/webhook'){
            next();
        }else{
            express.json()(req,res,next)
        }
    })
    // app.use(express.json())
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/cart', cartRouter)
    app.use('/category', categoryRouter)
    app.use('/subcategory', subcategoryRouter)
    app.use('/brand', brandRouter)
    app.use('/product', productRouter)
    app.use('/coupon', couponRouter)
    app.use('/order', orderRouter)
    app.use('/review', reviewRouter)
    //welcome message
    // app.use('/', (req, res, next) => {
    //     res.json({ message: "Welcome" })
    // })
    app.use('*', (req, res, next) => {
        res.json("In-valid Routing check url  or  method")
    })
    app.use(golbalErrorHandling)

    connectDB()
}
export default initApp