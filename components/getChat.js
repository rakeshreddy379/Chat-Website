import { getUid } from "../services/auth.js";
import { chattingCollection } from "../model/chattingdocument.js";
async function getChat(req,res,next){
    try{
        const token=req.cookies['usertoken']
        const decoded=getUid(token)
        const senderName=decoded.username
        const {receiver}=req.body
        console.log(`${senderName},${receiver}`)
        const result1 = await chattingCollection.findOne({
            $and: [{$or: [
               { 'personOne.name': senderName },
               { 'personTwo.name': senderName }
             ]},{$or: [
               { 'personOne.name': receiver },
               { 'personTwo.name': receiver }
             ]}]
           });
           if(result1){

            res.status(202).json({result:result1})
           }
           else{
            res.status(300).json({result:result1})
           }
            }catch(error){
next(error)
    }
}
export {getChat}