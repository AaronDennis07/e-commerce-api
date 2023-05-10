const { UnauthorizedError } = require("../errors")

const checkPermissions = (requestUser,resourceUserId)=>{
    console.log(requestUser)
    if(requestUser.role === 'admin') return 
    if(requestUser.userId === resourceUserId.toString()) return 
    throw new UnauthorizedError("You do not have access")

}

module.exports = checkPermissions