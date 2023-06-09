const { StatusCodes } = require('http-status-codes')
const Product  = require('../models/Product')
const { NotFoundError } = require('../errors')
const CustomError = require('../errors')
const path = require('path');
const createProduct = async(req,res)=>{
    req.body.user  =req.user.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({
        product
    })
}

const getAllProducts = async(req,res)=>{
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({
        products,count:products.length
    })
}
const getSingleProduct = async(req,res)=>{
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId }).populate('reviews')
  
    if (!product) {
      throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }
  
    // res.status(StatusCodes.OK).json({ 
    //     name:product.name,
    //     colors:product.colors,
    //     description:product.description,
    //     price:product.price,
    //     image:product.image,
    //     featured:product.featured,
    //     freeeShipping:product.freeShipping,
    //     averageRating:product.averageRating,
    //     company:product.company,
    //     createdAt:product.createdAt,
    //     updatedAt:product.updatedAt,
    //     category:product.category,
    //     user:product.user,
    //     reviews:product.reviews
    // });
    
    res.status(StatusCodes.OK).json({
        product
    })
}
const updateProduct = async(req,res)=>{
    const {id:productId} = req.params
    const product = await Product.findOneAndUpdate({_id:productId},req.body,{
        runValidators:true,
        new:true
    })
    if(!product) throw new NotFoundError(`No product found with product ID ${productId}`)
    res.status(StatusCodes.OK).json({
        product
    })
}
const deleteProduct = async(req,res)=>{
    const {id:productId} = req.params
    let product = await Product.findOne({_id:productId})
    if(!product) throw new NotFoundError(`No product found with product ID ${productId}`)
    await product.remove()
    res.status(StatusCodes.OK).json({
        message:'success'
    })
}
const uploadImage = async (req, res) => {
    if (!req.files) {
      throw new CustomError.BadRequestError('No File Uploaded');
    }
    const productImage = req.files.image;
  
    if (!productImage.mimetype.startsWith('image')) {
      throw new CustomError.BadRequestError('Please Upload Image');
    }
  
    const maxSize = 1024 * 1024;
  
    if (productImage.size > maxSize) {
      throw new CustomError.BadRequestError(
        'Please upload image smaller than 1MB'
      );
    }
  
    const imagePath = path.join(
      __dirname,
      '../public/uploads/' + `${productImage.name}`
    );
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
  };

module.exports = {
    getAllProducts,getSingleProduct,createProduct,deleteProduct,uploadImage,updateProduct
}