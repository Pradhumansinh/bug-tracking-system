import Notification from "../models/Notification.js"
// get user notificaton
export const getNotifications=async (req,res)=>{
    try{
        const notifications = await Notification.find({
            user:req.user._id
        }).sort({ createdAt:-1})

        res.json(notifications)

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

// mark as read
export const markAsRead=async(req,res)=>{
    try{
        const notification = await Notification.findById(req.params.id)

        if(!notification){
            return res.status(404).json({
                message:"Not Found"
            })
        }
        notification.read=true 
        await notification.save()
        res.json({message:"Marked as read"})

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}