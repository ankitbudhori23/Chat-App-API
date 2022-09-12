const express = require("express");
const router = express();
const Post = require("../DB/Post");
const mongoose = require("mongoose");
//get user post
router.get("/:username", async (req, res) => {
  try {
    const post = await Post.find({ username: req.params.username }).sort({
      $natural: -1
    });
    res.status(200).json({ data: post });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all posts
// router.get("/", async (req, res) => {
//   const du = await Post.find().sort({ $natural: -1 });
//   res.json({ data: du });
// });

router.get("/", async (req, res) => {
  let { page, size } = req.query;
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 7;
  }
  const limit = parseInt(size);
  const skip = (page - 1) * size;
  const user = await Post.find().limit(limit).skip(skip).sort({ $natural: -1 });
  res.json({ page, size, data: user });
});

// Create a post
router.post("/", async (req, res) => {
  // const postimg = req.files.img;
  // res.status(200).json(postimg.name);
  // console.log(postimg);
  const { userId, username, name, desc, img } = req.body;
  const newpost = new Post({
    userId,
    username,
    name: name,
    desc,
    img: img
    //  `https://s9oye9.sse.codesandbox.io/Img/` + userId + postimg.name
  });
  try {
    let savepost = await newpost.save();
    // postimg.mv("Public/Img/" + userId + postimg.name, (err) => {
    //   if (err) return res.status(500).send(err);
    // });
    res.status(200).json({ message: "Post Posted", data: savepost });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Edit a  post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like -- dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//comment a post (insert)

router.put("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({
      $push: {
        comments: {
          _id: mongoose.Types.ObjectId(),
          userId: req.body.userId,
          username: req.body.username,
          comment: req.body.comment,
          name: req.body.name
        }
      }
    });
    res.status(200).json({ success: "comment is added" });
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete comment of a post
// router.put("/:id/de-comment", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     const a = await post.updateOne({
//       $pull: {
//         comments: { _id: req.body.comtid
//       }
//     });
//     res.status(200).json({ a, msg: "comment is added" });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
