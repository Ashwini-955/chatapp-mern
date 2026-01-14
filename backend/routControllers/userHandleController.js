import Conversation from "../Models/conversationModels.js";
import User from "../Models/userModels.js";

export const getUserBySearch=async(req,res)=>{
    try {
        const search =req.query.search || '';
        const currentUserId = req.user._id;
        const users =await User.find({
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

        // Sort users by relevance score
        const sortedUsers = users.sort((a, b) => {
            const searchLower = search.toLowerCase();
            const aUsername = a.username.toLowerCase();
            const aFullname = a.fullname.toLowerCase();
            const bUsername = b.username.toLowerCase();
            const bFullname = b.fullname.toLowerCase();

            const getScore = (username, fullname) => {
                if (username === searchLower) return 10;
                if (fullname === searchLower) return 9;
                if (username.startsWith(searchLower)) return 8;
                if (fullname.startsWith(searchLower)) return 7;
                if (username.includes(searchLower)) return 6;
                if (fullname.includes(searchLower)) return 5;
                return 0;
            };

            const scoreA = getScore(aUsername, aFullname);
            const scoreB = getScore(bUsername, bFullname);

            return scoreB - scoreA; // Higher score first
        });

        res.status(200).send(sortedUsers)
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
