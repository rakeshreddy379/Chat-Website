import {OTPdetails} from '../model/otpmodel.js'
import { setUid } from '../services/auth.js'
async function otpverify(req,res,next){
    try{
    const {otp,username}=req.body
    const getotp=await OTPdetails.findOne({userName:username})
    if(!getotp){
                res.status(404).json({msg:'otp is mismatched'})

    }
    if(otp==getotp.OTP){
        const token=await setUid(getotp)
        try  {  res.cookie('otptoken', token, { httpOnly: false});
        console.log('cookie is done') // Cookie will expire in 1 hour);
         } 
         catch(error){
            next(error)
         }
        res.status(200).json({msg:'otp verified'})
    }
    else{
        res.status(404).json({msg:'otp is mismatched'})
    }}
    catch(error){
        next(error)
    }
}
export {otpverify}