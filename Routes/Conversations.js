const router = require("express").Router();
const Conversation = require("../DB/Conversation");

//new convs
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId]
  });

  const present = await Conversation.findOne({
    members: { $all: [req.body.senderId, req.body.receiverId] }
  });
  if (present) {
   res.status(200).json({ status: "chat exists", data: present });
  } else {
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json({ data: savedConversation });
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

//get conv of a user to whom he talk
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] }
    });
    res.status(200).json({ data: conversation });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] }
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
