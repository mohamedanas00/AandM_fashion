import connectDB from "../DB/connection.js"
import authRouter from "./modules/auth/auth.routes.js"
import brandRouter from "./modules/brand/brand.routes.js"
import cartRouter from "./modules/cart/cart.routes.js"
import categoryRouter from "./modules/category/category.routes.js"
import productRouter from "./modules/product/proutuct.routes.js"
import subcategoryRouter from "./modules/subcategory/subcategory.routes.js"
import { golbalErrorHandling } from "./utils/errorHandling.js"



const initApp = (app, express) => {
    //convert Buffer Data
    app.use(express.json())
    app.use('/auth', authRouter)
    app.use('/cart', cartRouter)
    app.use('/category', categoryRouter)
    app.use('/subcategory', subcategoryRouter)
    app.use('/brand', brandRouter)
    app.use('/product', productRouter)

    app.use('*', (req, res, next) => {
        res.json("In-valid Routing check url  or  method")
    })
    app.use(golbalErrorHandling)

    connectDB()
}
export default initApp