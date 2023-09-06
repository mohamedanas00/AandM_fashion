import path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
const app = express()
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
import initApp from './src/index.routes.js'
// setup port and the baseUrl
initApp(app, express)
const port = +process.env.PORT

//welcome message
app.get('/', (req, res, next) => {
    res.json({ message: "Welcome" })
})

app.listen(port, () => console.log(`App listening on port:${port}!`))