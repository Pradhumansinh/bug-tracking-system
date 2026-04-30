import mongoose from "mongoose"

const projectSchema= new mongoose.Schema({
    name:{
        type :String,
        required:true,
    },
    description:String,
    status:{
        type:String,
        enum:["Active","Completed","Archived"],
        default:"Active",
    },
    members:[
        { type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        }
    ],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps : true})

export default mongoose.model("Project",projectSchema)