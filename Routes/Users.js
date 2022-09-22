const express = require("express");
const router = express();
const User = require("../DB/User");

//get all posts
router.get("/", async (req, res) => {
  const alluser = await User.find().sort({ $natural: -1 });
  res.json({ data: alluser });
});

// update user profile.
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
      });
      const updata = await User.findById(req.params.id);
      res.status(200).json({ message: "Accout Updated", user: updata });
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

// find unique username is available
router.post("/username", async (req, res) => {
  let uname = await User.findOne({ username: req.body.username });
  if (uname) {
    res.json({ error: "This username exists" });
  } else {
    res.json({ success: "This username available" });
  }
});

// update unique username
router.put("/username/:id", async (req, res) => {
  let uname = await User.findOne({ username: req.body.username });
  if (uname) {
    res.status(500).json({ error: "This username exists" });
  } else {
    if (req.body.userId === req.params.id) {
      const d = await User.findByIdAndUpdate(
        req.params.id,
        {
          username: req.body.username
        },
        { new: true }
      );
      res.status(200).json({ user: d });
    }
  }
});

// delete user profile
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

// Find a User
router.get("/finduser", async (req, res) => {
  const username = req.query.username;
  const userid = req.query.userid;
  try {
    if (userid) {
      const usera = await User.findById(userid);
      if (usera) {
        const updata = usera.toObject();
        delete updata.password;
        delete updata.updatedAt;
        res.status(200).json({ data: updata });
      }
    } else {
      const user = await User.findOne({ username: username });
      if (user) {
        const friends = await Promise.all(
          user.followings.map((friendId) => {
            return User.findById(friendId);
          })
        );
        let friendList = [];
        friends.map((friend) => {
          const { username, firstname, surname, profilePicture } = friend;
          friendList.push({ firstname, surname, username, profilePicture });
        });
        const updata = user.toObject();
        delete updata.password;
        delete updata.updatedAt;
        res.status(200).json({ data: updata, friends: friendList });
      } else {
        res.status(500).json({ type: "error", message: "user not found" });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        const aw = await User.findById(req.body.userId);
        res.status(200).json({
          data: aw,
          message: "User has been followed"
        });
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a users

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        const aw = await User.findById(req.body.userId);
        res.status(200).json({
          data: aw,
          message: "User has been unfollowed"
        });
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

module.exports = router;
