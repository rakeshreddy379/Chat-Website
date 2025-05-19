import { User } from "../model/index.js";
import { getUid } from "../services/auth.js";
import { chattingCollection } from "../model/chattingdocument.js";
async function makeFriendRequest(req,res,next){
    const token=req.cookies['usertoken']
    try{const decoded=getUid(token)
    //hecking validation of token
    const sendername=decoded.username
    const {friendName}=req.body
    const sendresult=await User.updateOne({userName:sendername},{
        $push:{
                friends:friendName
        }
    })
    const result2=await User.updateOne({userName:friendName},{
        $push:{
            friends:sendername
        }
    })
    const chatting=await chattingCollection.create({
personOne:{
    name:sendername
},
personTwo:{
    name:friendName
}
    })
    console.log(chatting)
    if(result2&&sendresult) res.status(202).json({message:'you both are friends'})
    else res.status(500).json({message:'some thing gone wrong'})
}
    catch(error){
        next(error)
    }
}
export{makeFriendRequest}