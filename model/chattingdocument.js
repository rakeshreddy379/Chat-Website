import  mongoose from 'mongoose'
const chattingSchema=new mongoose.Schema({
    personOne:{
        
            name:{
                type:String,
                required:true
            },
            messages:[{
                message:{
                    type:String,
                    
                },
                time:{
                    type: String,
                },
                ack:{
                    type:String,
                },
                
            }
            ]
        
    },personTwo:{
        
        name:{
            type:String,
            required:true
        },           

        messages:[{
            message:{
                type:String,
                
            },
            time:{
                type: String,
            }}
        ]
    
}
})
const chattingCollection=mongoose.model('chattingCollection',chattingSchema)
export{chattingCollection}