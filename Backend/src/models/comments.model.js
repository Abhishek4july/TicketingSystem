import mongoose, { Schema } from "mongoose";

const commentSchema= new Schema({
    ticketId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ticket',
        required:true
    },
    authorId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    content:{
        type:String,
        default:""
    },
    attachments: [
        {
          url: String,         
          publicId: String,    
          fileName: String,    
          mimeType: String,   
          size: Number
        }
      ]
      
},
{
   timestamps:true
})

export const Comments=mongoose.model("Comments",commentSchema)