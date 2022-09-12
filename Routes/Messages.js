const router = require("express").Router();
const Message = require("../DB/Message");

//add
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  if (req.body.conversationId || req.body.text) {
    try {
      const savedMessage = await newMessage.save();
      res.status(200).json({ data: savedMessage });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json({ error: "Enter message" });
  }
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    });
    res.status(200).json({ data: messages });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
