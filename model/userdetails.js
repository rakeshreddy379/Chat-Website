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
},hashedPassword:{
    type:String,
    required:true
}
},{timestamps:true})
const Userdetails=mongoose.model('userdetails',userSchema)
export {Userdetails}