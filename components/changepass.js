import { Userdetails } from "../model/userdetails.js";
import { getUid} from "../services/auth.js";
import { User } from "../model/index.js";
import bcrypt from 'bcrypt'
async function changepassword(req,res,next){
const saltRounds=10;
if(req.cookies.otptoken){
    try{
    const decoded=await getUid(req.cookies.otptoken)
    const {password}=req.body
    bcrypt.hash(password,saltRounds,async(error,hash)=>{
        if(error){
            next(error)
        }
        else{
            var result=await Userdetails.updateOne
            ({userName:decoded.username},{$set:{hashedPassword:hash}})
            if(result){
            result=await User.findOne({userName:decoded.username})
                res.status(200).json({msg:'Your password has changed successfully',username:result.userName,userprofile:result.userProfile})
            }
            else{
                res.staus(404).json({msg:'something is wrong,try another time'})
            }
        }
    })
}
catch(error){
    next(error)
}
}
else{
    res.status(404).json({msg:'Try another time'})
}

}
export {changepassword}