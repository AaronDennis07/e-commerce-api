const Review = require('../models/Review')
const Product = require('../models/Product')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')
const { checkPermissions } = require('../utils')
const CustomError = require('../errors/index')
const createReview = async(req,res)=>{
    const {product:productId} = req.body
    const product = await Product.findOne({_id:productId})
    if(!product) throw new NotFoundError('Invalid product ID')
    const alreadySubmitted = await Review.findOne({
        product:productId,
        user:req.user.userId
    })
    if (alreadySubmitted) {
        throw new CustomError.BadRequestError(
          'Already submitted review for this product'
        );
      }
    
    req.body.user = req.user.userId
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({
        review
    })
}
const getAllReviews = async(req,res)=>{
    const reviews = await Review.find({})
                                .populate({
                                    path:'product',
                                    select:'name company price'
                                })
                                
    res.status(StatusCodes.OK).json({
        reviews
    })
}
const getSingleReview = async(req,res)=>{
    const review = await Review.findOne({_id:req.params.id})
    if(!review) throw new NotFoundError('review not found')
    res.status(StatusCodes.OK).json({
        review
    })
}
const updateReview = async(req,res)=>{
    const {rating,title,comment} = req.body
    const review = await Review.findOne({_id:req.params.id})
    if(!review) throw new NotFoundError('Review not found')
    checkPermissions(req.user,review.user)
    review.comment = comment
    review.rating = rating
    review.title = title
    await review.save()
    res.status(StatusCodes.OK).json({
        review
    })
}
const deleteReview = async(req,res)=>{
    const review = await Review.findOne({_id:req.params.id})
    if(!review) throw new NotFoundError('Review not found')
    checkPermissions(req.user,review.user)
    await review.remove()
    res.status(StatusCodes.OK).json({
        review
    })
}

const getReviewsSingleProduct = async(req,res)=>{
    const {id:productId} = req.params
    const reviews = await Review.find({product:productId})
    res.status(StatusCodes.OK).json({
        reviews
    })
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getReviewsSingleProduct
}