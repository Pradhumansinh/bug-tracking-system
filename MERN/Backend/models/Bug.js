import mongoose from "mongoose"

const bugSchema = new mongoose.Schema(
    {
        title:{
           type:String,
            required:true,
        },
        description:{
            type:String,
        },
        status:{
            type:String,
            enum:["Open","In Progress","Resolved","Pending Verification","Closed"],
            default:"Open"
        },
        priority:{
            type:String,
            enum:["Low","Medium","High"],
            default:"Medium"
        },
        assignedTo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        project:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project",
            required:true
        },
        image:{
            type:String
        },
        history:[{
            action:String,
            user:{type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            timestamp:{type:Date,
                default:Date.now
            }
        }],
        comments:[
            {
                text:String,
                user:{
                    type:mongoose.Schema.Types.ObjectId,
                ref:"User"
                },
                createdAt:{
                    type:Date,
                    default:Date.now
                }
            }
        ],

      
    },{timestamps: true }
)

export default mongoose.model("Bug",bugSchema)