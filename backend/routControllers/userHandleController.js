import Conversation from "../Models/conversationModels.js";
import User from "../Models/userModels.js";

export const getUserBySearch=async(req,res)=>{
    try {
        const search =req.query.search || '';
        const currentUserId = req.user._id;
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
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(error);
    }
}

export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const currentChatters = await Conversation.find({
      participants: currentUserId
    }).sort({ updatedAt: -1 });

    if (!currentChatters || currentChatters.length === 0) {
      return res.status(200).json([]);
    }

    // get all other participant IDs
    const participantIds = currentChatters.reduce((ids, conversation) => {
      const others = conversation.participants.filter(
        id => id.toString() !== currentUserId.toString()
      );
      return [...ids, ...others];
    }, []);

    // remove duplicates
    const uniqueParticipantIds = [
      ...new Set(participantIds.map(id => id.toString()))
    ];

    const users = await User.find({
      _id: { $in: uniqueParticipantIds }
    })
      .select("-password")
      .select("email username profilepic");

    return res.status(200).json(users);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
