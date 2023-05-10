/**             DEV ONLY            */

/*
const morgan = require('morgan')
app.use(morgan('tiny'))
 app.get('/reset',async(req,res)=>{
     await User.deleteMany()
     await Review.deleteMany()
     await Product.deleteMany()
     res.send('success')
 })
*/

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
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')



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
//app.use(cors())

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json({extended:true}))

app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/products',productRoutes)
app.use('/api/v1/reviews',reviewRoutes)
app.use('/api/v1/orders',orderRoutes)



app.get('/api/v1/check',(req,res)=>{
    console.log(req.cookies)
    console.log(req.signedCookies.token)
    res.send('success')
})
app.use(notFound)
app.use(customErrorhandler)
const start = async()=>{
    await connectDB(process.env.MONGO_URI)
    app.listen(process.env.PORT,(err)=>{
        console.log(`Listening at port ${process.env.PORT}`)
    })
}
start()
