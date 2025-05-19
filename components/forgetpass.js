import { User } from "../model/index.js";
import {OTPdetails} from '../model/otpmodel.js'
import { getUid } from "../services/auth.js";
import nodemailer from 'nodemailer'
async function forgetpass(req,res,next){
    try{
    const {username}=req.body;
    const result=await User.findOne({userName:username})
    if(!result){
        res.status(404).json({msg:'User not Found'})
    }
    const transporter=nodemailer.createTransport({
      host: 'smtp.gmail.com',
  port: 465,
  secure: true,
        auth:{
            user:'rakeshreddyregati119@gmail.com',
            pass:'slas gdie hhcl baxc'}
    })
    const random=Math.floor(Math.random()*100000
)
    const mailoptions={
        from:'rakeshreddyregati119@gmail.com',
        to:result.email,
        subject:`Your one time password(OTP) is ${random}`
    }
    try{
    const response=await transporter.sendMail(mailoptions)
    const create= await OTPdetails.create({
        userName:username,
  email:result.email,
  OTP: random,
  createdAt: new Date()

})
if(create){
     res.status(200).json({msg:'sent'})
    }
    else{
res.status(404).json({msg:'error'})
    }}
    catch(error){
        next(error)
    }
}
catch(error){
    next(error)
}
}
export {forgetpass}