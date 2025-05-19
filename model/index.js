import  mongoose from 'mongoose'
const userSchema=new mongoose.Schema({
    userProfile:{
type:String,
// required:true,
    },
userName:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
friends:[],
request:[],
},{timestamps:true})
const User=mongoose.model('users',userSchema)
export {User}