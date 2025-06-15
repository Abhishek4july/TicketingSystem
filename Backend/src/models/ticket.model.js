import mongoose, { Schema } from "mongoose";

const ticketSchema=new Schema({
     subject:{
        type:String,
        required:true
     },
     description:{
        type:String,
        required:true
     },
     priority: {
        type: String,
        enum: ['low', 'medium', 'high','critical','super critical'],
        default: 'low',
        required: true
      },
      tags: {
        type: [String],
        default: []
      },
      attachments: [
  {
    url: String,
    public_id: String
  }
],

      status: {
        type: String,
        enum: ['open','in-progress','On hold','resolved','closed'], 
        default: 'open',  
        required: true    
      },
      assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
      },
      closedAt: {
    type: Date,
     default: null,
     index: {
     expireAfterSeconds: 2592000, 
      partialFilterExpression: { status: "closed" }
}
    },

      createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
      },  
      fullName:{
        type:String,
        req:true
      }
},
  {
    timestamps:true
  }    
)

export const Ticket=mongoose.model("Ticket",ticketSchema)