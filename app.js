require('dotenv').config()
require('express-async-errors')
const express = require('express')
const connectDB = require('./db/connect')
const customErrorhandler = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const User = require('./models/User')
const app = express()
const productRoutes = require('./routes/productRoutes')
const cookieParser  =require('cookie-parser')
const reviewRoutes = require('./routes/reviewRoutes')
const Review = require('./models/Review')
const Product = require('./models/Product')
const orderRoutes = require('./routes/orderRoutes')
const fileUpload = require('express-fileupload');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.set('trust proxy',1)
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max:60
    })
)
app.use(mongoSanitize())
app.use(xss())
app.use(helmet())
app.use(cors())


app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json({extended:true}))
app.use(fileUpload())


app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/products',productRoutes)
app.use('/api/v1/reviews',reviewRoutes)
app.use('/api/v1/orders',orderRoutes)
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument));



app.use(notFound)
app.use(customErrorhandler)

const start = async()=>{
    await connectDB(process.env.MONGO_URI)
    app.listen(process.env.PORT,(err)=>{
        console.log(`Listening at port ${process.env.PORT}`)
    })
}
start()
