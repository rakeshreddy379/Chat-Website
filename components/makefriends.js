import { getUid } from "../services/auth.js";
import { User } from "../model/index.js";
async function getNewFriends(req,res,next){
     try{
    const usertoken=req.cookies['usertoken']
    console.log(`cookie is ${usertoken}`)
    if(!usertoken){ res.status(401).json({message:'please login'})}
     const decoded=await getUid(usertoken)
console.log(decoded)
     const result=await User.findOne({userName:decoded.username})
     console.log(result)
     const friendList=result.friends
     // const friendsArray= friendList.map(obj=> Object.values(obj)[0])
    console.log(friendList)
     
     const notFriends=await User.find({userName:{$nin:friendList}})
     console.log(`friend are ${notFriends}`)
res.status(202).json({friends:notFriends})}
catch(error){
     next(error)
}
}
     
export {getNewFriends}