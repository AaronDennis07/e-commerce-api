const {StatusCodes} = require('http-status-codes')
const User = require('../models/User')
const customError = require('../errors/index')
const createTokenUser = require('../utils/createTokenUser')
const { attachCookiesToResponse } = require('../utils/jwt')
const { checkPermissions } = require('../utils')

const getAllUsers = async (req,res)=>{
    const users = await User.find({role:'user'}).select('-password')

    res.status(StatusCodes.OK).json({
        users
    })
}
const getSingleUser = async (req,res)=>{
    const user = await User.findOne({_id:req.params.id}).select('-password')
    if(!user) throw new customError.NotFoundError('No user found')
    checkPermissions(req.user,req.params.id)
    res.status(StatusCodes.OK).json({
        user
    })
}
const showCurrentUser = async (req,res)=>{
    console.log(req.user)
    res.status(StatusCodes.OK).json({
        user:req.user
    })
}
const updateUser = async (req,res)=>{
    const {email,name}  =req.body
    if(!email || !name) throw new BadRequestError('Email and Name must be provided')
    const user = await User.findByIdAndUpdate(req.user.userId,{email,name},{
        new:true,runValidators:true
    })
    const payload = createTokenUser(user)
    attachCookiesToResponse({res,user:payload})
    res.status(StatusCodes.OK).json({
        user:payload
    })
}
const updateUserPassword = async (req,res)=>{
    const {oldPassword,newPassword}  =req.body
    if(!oldPassword || !newPassword) throw new BadRequestError("old and new password is requried")
    const user = await User.findOne({_id:req.user.userId});
    const isMatch = await user.comparePassword(oldPassword)
    if(!isMatch) throw new customError.UnauthorizedError('You do not have authorization')
    user.password = newPassword
    await user.save()
    res.status(StatusCodes.OK).json({
        msg:'successfully changed'
    })
}

module.exports = {
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserPassword,
    showCurrentUser
}