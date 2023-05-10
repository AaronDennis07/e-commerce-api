const {StatusCodes} = require('http-status-codes')
const User = require('../models/User')
const { BadRequestError } = require('../../final/errors')
const { createJWT } = require('../utils')
const { attachCookiesToResponse } = require('../utils/jwt')
const createTokenUser = require('../utils/createTokenUser')
const { UnauthenticatedError } = require('../errors')
const register = async(req,res)=>{
    const {email,name,password} = req.body
    const alreadyExits = await User.findOne({email})
    if(alreadyExits)  throw new BadRequestError('Email ID already exists')
    const count = await User.countDocuments({})
    const role = count === 0 ? 'admin' : 'user'
    const user = await User.create({email,name,password,role})
    const payload = createTokenUser(user)
    
    attachCookiesToResponse({user:payload,res})
    res.status(StatusCodes.CREATED).json({
        user
    })
}
const login = async(req,res)=>{
    const {email,password}  = req.body
    if(!email || !password) throw new BadRequestError('Email and password must be provided')
    const user = await User.findOne({email})
    if(!user) throw new BadRequestError("User does not exists")
    console.log(user)

    const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  const payload = createTokenUser(user)
    
    attachCookiesToResponse({user:payload,res})
    res.status(StatusCodes.CREATED).json({
        user
    })
}
const logout = async(req,res)=>{
    res.send('logout')
}

module.exports={login,logout,register}
