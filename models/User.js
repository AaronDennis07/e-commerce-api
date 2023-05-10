const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        maxlength:50,
        minlength:3,
        required:[true,'Please provide a name']
    },
    email:{
        type:String,
        required:[true,'Please provide an email'],
        unique:true,
        validate:{
            validator: validator.default.isEmail,
            message:'please provide a valid email ID'
        }
    },

    password:{
        type:String,
        required:[true,'Please provide an password'],
        minlength:6,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }
})

UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
  };
  

module.exports = mongoose.model('UserSchema',UserSchema)