
import { getUid } from "../services/auth.js"
async function getTokens(req,res,next){
    if(req.cookies.usertoken) {
        const user=getUid(req.cookies.usertoken)
        
        res.status(202).json({message:'token is there',username:user.username,email:user.email})}
    else res.status(404).json({message:'token not found'})
}
export{getTokens}