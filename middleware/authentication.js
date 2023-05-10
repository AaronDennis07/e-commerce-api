
const { UnauthenticatedError } = require('../errors')
const {isTokenValid}  =require('../utils/jwt')

const authenticateUser = (req,res,next)=>{
    const token = req.signedCookies.token
    if(!token) throw new UnauthenticatedError('Invalid authentication')
    try {
        const payload = isTokenValid({token})
        req.user = {userId:payload.userId,name:payload.name,role:payload.role}
        next()
    } catch (err) {
        throw new UnauthenticatedError('Invalid authentication')        
    }
}

const authorizePermissions = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)) throw new UnauthorizedError('You do not have access')
        next()
    }
}
module.exports = {authenticateUser,authorizePermissions}