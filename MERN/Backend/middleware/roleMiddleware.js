const authorizeRoles =(...roles) =>{
    return(req,res,next)=>{

        //check if user exists
        if(!req.user){
            return res.status(401).json({
                message:"User not authenticated"
            })
        }
        // check role
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message:`Role ${req.user.role} not allowed`
            })
        }

        next()
    }
}

export default authorizeRoles;



export const allowRoles = (...roles)=>{
    return(req,res,next)=>{
        if(!req.user){
            return res.status(401).json({
                message:"Not authenticated"
            })
        }
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message:"Access Denied"
            })
        }
        next()
    }
}