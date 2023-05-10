const CustomAPIError  = require('../errors')
const Order = require('../models/Order')
const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const checkPermissions = require('../utils/checkPermissions')
const fakeStripeAPI = async({amount,currency})=>{
    const client_secret = 'fake client'
    return {client_secret,amount}
}

const createOrder = async(req,res)=>{
    const {items:cartItems,tax,shippingFee} = req.body
    if(!cartItems || cartItems.length < 1) throw new CustomAPIError.BadRequestError('No cart items ')
    if(!tax || !shippingFee) throw new CustomAPIError.BadRequestError('tax and shipping fee must be provided')
    let subtotal = 0
    let orderItems = []

    for(const item of cartItems){
        console.log(item)
        const dbProduct = await Product.findOne({_id:item.product})

        if (!dbProduct) {
            throw new CustomAPIError.NotFoundError(
              `No product with id : ${item.product}`
            );
          }
          const {name,price,image,_id} = dbProduct
          const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id
          }
          orderItems = [...orderItems,singleOrderItem]
          subtotal += item.amount * price

    }
    const total = tax + shippingFee + subtotal;
    console.log(total)
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
      });
    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        user:req.user.userId,
        clientSecret: paymentIntent.client_secret
    })

    res.status(StatusCodes.OK).json({
        order,
        clientSecret:order.clientSecret
    })
}

const getAllOrders = async (req,res)=>{
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({
        orders,count:orders.length
    })
}

const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      throw new CustomAPIError.NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermissions(req.user, order.user);
    res.status(StatusCodes.OK).json({ order });
  };
  const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
  };

const updateOrder = async(req,res)=>{
    const {id:orderId} = req.params
    const {paymentIntentId} = req.body

    const order = await Order.findOne({_id: orderId})
    if (!order) {
        throw new CustomAPIError.NotFoundError(`No order with id : ${orderId}`);
      }
      checkPermissions(req.user, order.user);
      order.paymentIntentId = paymentIntentId
      order.status = 'paid'
      await order.save()
      res.status(StatusCodes.OK).json({ order });

}

module.exports = {
    updateOrder,
    createOrder,
    getSingleOrder,
    getAllOrders,
    getCurrentUserOrders
}