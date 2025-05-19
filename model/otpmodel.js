import  mongoose from 'mongoose'
const OTPSchema=new mongoose.Schema({
    
userName:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
OTP:{
type:Number,
required:true
},
createdAt: { type: Date, default: Date.now, expires:60}},{timestamps:true})
const OTPdetails=mongoose.model('OTPdetails',OTPSchema)
export {OTPdetails}