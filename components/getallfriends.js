import { User } from "../model/index.js";
import { getUid } from "../services/auth.js";
async function getAllFriends(req,res,next){
    const token=req.cookies['usertoken']
    
    try{const decoded=getUid(token)
    
    const result=await User.findOne({userName:decoded.username})
var friendsList=result.friends
friendsList=friendsList.filter(value=>value!==decoded.username)
console.log(friendsList)
console.log(friendsList)
const friends=await User.find({userName:{$in:friendsList}})
res.status(202).json({friends:friends})
}catch(error){
    next(error)
    
}
}
export {getAllFriends}