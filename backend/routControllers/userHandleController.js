export const getUserBySearch=async(req,res)=>{
    try {
        const search =req.query.search || '';
        const currentUserId=req.user._conditions._id;
        const user =await User.find({
            $and:[{
                $or:[
                    {username:{$regex:'.*'+search+'.*',$options:'i'}},
                    {fullname:{$regex:'.*'+search+'.*',$options:'i'}},
                ]
            },
            {
                _id:{$ne:currentUserId}
            }
        ]
        }).select("-password").select("email")
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(error);
    }
}