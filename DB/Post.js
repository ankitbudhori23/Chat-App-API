const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    username: {
      type: String
    },
    desc: {
      type: String
    },
    img: {
      type: String
    },
    likes: {
      type: Array,
      default: []
    },
    comments: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
