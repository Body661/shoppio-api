import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import dbConnect from './config/db.mjs'
import categoryRoutes from "./Routes/category.mjs";

dotenv.config({path: 'config.env'})

// App configuration
const app = express();
const PORT = process.env.PORT

dbConnect();

// Middleware
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"))
}

// Mount Routes
app.use('/api/categories', categoryRoutes)
app.all("*" , (req, res, next) => {
    const err = new Error(`'${req.originalUrl}' is not a valid route`)
    next(err.message)
})

//Error Handler
app.use((err, req, res, next) => {
    res.status(400).json({err})
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})